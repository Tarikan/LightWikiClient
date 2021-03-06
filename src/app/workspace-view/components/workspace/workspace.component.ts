import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {Article} from "../../../shared/models/articles/article";
import {ArticleService} from "../../../api/article.service";
import {WorkspaceService} from "../../../api/workspace.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Errors, errorToEnum} from "../../../core/enums/errors";
import {BehaviorSubject, catchError, EMPTY, Subject, tap} from "rxjs";
import {QueryParamNames} from "../../query-param-names";
import {WorkspaceViewService} from "../../workspace-view.service";

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private workspaceService: WorkspaceService,
    private workspaceViewService: WorkspaceViewService) {
    this.workspaceObservable = new BehaviorSubject<Workspace | undefined>(this.workspace);
  }

  ngOnInit(): void {
    this.workspaceViewService.errorSubject.subscribe(err => {
      this.hasError = err!;
    });

    this.route.params.subscribe(result => {
      this.workspaceViewService.onSlugsChange(result[QueryParamNames.workspaceSlug], result[QueryParamNames.articleSlug]);
      this.hasError = undefined;
      let oldWorkspaceSlug = this.workspaceSlug;
      this.workspaceSlug = result[QueryParamNames.workspaceSlug];
      this.articleSlug = result[QueryParamNames.articleSlug];

      //console.log(this.workspaceSlug, this.articleSlug);

      if (oldWorkspaceSlug != this.workspaceSlug ||
        this.articleSlug == '' ||
        this.articleSlug == undefined)
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
              this.hasError = errorToEnum(error.status);
              return EMPTY;
            }))
          .subscribe();
    })
  }

}
