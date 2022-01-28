import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {Article} from "../../../shared/models/articles/article";
import {ArticleService} from "../../../api/article.service";
import {WorkspaceService} from "../../../api/workspace.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Errors, ErrorToEnum} from "../../../core/enums/errors";
import {BehaviorSubject, catchError, EMPTY, map, Observable, Subject, tap} from "rxjs";

@Component({
  selector: 'app-api',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  public isInitialized = false;
  public hasError: Errors | undefined;
  public workspaceSlug: string = '';
  public articleSlug: string = '';
  public workspace: Workspace | undefined;
  public article: Article | undefined;
  public workspaceObservable: BehaviorSubject<Workspace | undefined>;
  public slugsObservable: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>(
    [this.workspaceSlug, this.articleSlug]
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private workspaceService: WorkspaceService) {
    this.workspaceObservable = new BehaviorSubject<Workspace | undefined>(this.workspace!);
  }

  ngOnInit(): void {
    this.route.params.subscribe(result => {
      let oldWorkspaceSlug = this.workspaceSlug;
      this.workspaceSlug = result['workspace_slug'];
      this.articleSlug = result['article_slug'];
      this.slugsObservable.next([this.workspaceSlug, this.articleSlug]);

      //console.log(this.workspaceSlug, this.articleSlug);

      if (oldWorkspaceSlug != this.workspaceSlug)
        this.workspaceService.getWorkspaceBySlug(this.workspaceSlug, 'response')
          .pipe(
            tap((response: HttpResponse<Workspace>) => {
              if (response.body == undefined) {
                this.hasError = Errors.ServerError;
                return;
              }
              this.workspace = response.body;
              this.workspaceObservable.next(this.workspace);
              if (this.articleSlug == undefined) {
                this.router.navigate([`view/${this.workspaceSlug}/${this.workspace.workspaceRootArticleSlug}`]);
                return;
              }
              this.isInitialized = true;
            }),
            catchError((error: HttpErrorResponse) => {
              this.hasError = ErrorToEnum(error.status);
              return EMPTY;
            }))
          .subscribe();
      // console.log(this.workspaceSlug, this.articleSlug)
    })
  }

}
