import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../api/article.service";
import {catchError, EMPTY, tap} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {WorkspaceService} from "../../../api/workspace.service";
import {Article} from "../../../shared/models/articles/article";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {UpdateArticleContent} from "../../../api/requests/articles/update-article-content";
import {errorToRoute} from "../../../app-routing.module";
import {errorToEnum} from "../../../core/enums/errors";


@Component({
  selector: 'app-workspace-editor',
  templateUrl: './workspace-editor.component.html',
  styleUrls: ['./workspace-editor.component.css']
})
export class WorkspaceEditorComponent implements OnInit {

  public editor = ClassicEditor;
  public workspaceSlug: string = '';
  public articleSlug: string = '';
  public workspace: Workspace | undefined;
  public article: Article | undefined;
  public isInitialized: boolean = false;
  public articleText: string = '';

  @ViewChild("myEditor", {static: false}) myEditor: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private articleService: ArticleService,
              private workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(result => {
      this.workspaceSlug = result['workspace_slug'];
      this.articleSlug = result['article_slug'];

      this.workspaceService.getWorkspaceBySlug(this.workspaceSlug, 'response')
        .pipe(
          tap((response: HttpResponse<Workspace>) => {
            this.workspace = response.body!;

            this.articleService.getArticleBySlugs(this.workspaceSlug, this.articleSlug, 'body')
              .subscribe(result => {
                this.article = result!;
                this.articleService.articlesIdContentGet(this.article!.id, 'body')
                  .subscribe(result => {
                    this.articleText = result.text;
                    this.isInitialized = true;
                  })
              })
          }),
          catchError((error: HttpErrorResponse) => {
            this.router.navigate([errorToRoute(errorToEnum(error.status))]);
            return EMPTY;
          }))
        .subscribe();
    })
  }

  getArticleViewRoute(): string {
    return `/view/${this.workspaceSlug}/${this.articleSlug}`;
  }

  onSubmit(): void {
    let request: UpdateArticleContent = {text: this.myEditor.editorWatchdog._getData().main};
    this.articleService.articlesIdContentPost(this.article!.id, request, 'response')
      .pipe(catchError(error => {
        this.router.navigate([errorToRoute(errorToEnum(error.status))]);
        return EMPTY;
      }))
      .subscribe(_ => {
        this.router.navigate([`view/${this.workspaceSlug}/${this.articleSlug}`]);
      })
  }

}
