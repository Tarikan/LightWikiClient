import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, map, merge, Subject} from "rxjs";
import {ArticleService} from "../../../api/article.service";
import {Article} from "../../../shared/models/articles/article";
import {ArticleContent} from "../../../shared/models/articles/article-content";
import {Errors, errorToEnum} from "../../../core/enums/errors";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {
  UpdateArticleDialogComponent,
  UpdateArticleDialogData
} from "../update-article-dialog/update-article-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleVersionService} from "../../../api/article-version.service";
import {errorToRoute} from "../../../app-routing.module";
import {QueryParamNames} from "../../query-param-names";
import {WorkspaceViewService} from "../../workspace-view.service";

enum ViewType {
  content = 'content',
  history = 'history',
  access = 'access',
  historyView = "historyView",
}

@Component({
  selector: 'app-workspace-viewer',
  templateUrl: './workspace-viewer.component.html',
  styleUrls: ['./workspace-viewer.component.css']
})
export class WorkspaceViewerComponent implements OnInit, AfterViewInit {
  public ViewType = ViewType;
  public article: Article | undefined;
  private articleContent: ArticleContent | undefined;
  public viewType: ViewType = ViewType.content;
  public articleBehaviorSubject: BehaviorSubject<Article | undefined> =
    new BehaviorSubject<Article | undefined>(undefined);
  public articleVersion: number | undefined;
  public workspaceSlug: string | undefined;
  public articleSlug: string | undefined;

  private setViewType(viewType: ViewType): void {
    this.viewType = viewType;
  }

  navigateTo(viewType: ViewType) {
    this.router.navigate([`view/${this.workspaceSlug}/${this.articleSlug}`],
      {queryParams: {[QueryParamNames.viewType]: viewType}});
  }

  constructor(
    private workspaceViewService: WorkspaceViewService,
    private articleService: ArticleService,
    private articleVersionService: ArticleVersionService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
  }

  @ViewChild('articlePlaceholder') articlePlaceholder!: ElementRef;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let param = params[QueryParamNames.viewType];
      if (param !== undefined) {
        this.setViewType(param);
        if (param == ViewType.historyView) {
          this.articleVersion = params[QueryParamNames.articleVersion];
        }
      }
    })
  }

  ngAfterViewInit(): void {
    merge(this.route.queryParams,
      this.route.params).subscribe(_ => {
      this.articleSlug = this.route.snapshot.params[QueryParamNames.articleSlug]!;
      this.workspaceSlug = this.route.snapshot.params[QueryParamNames.workspaceSlug]!;

      if (this.workspaceSlug == undefined || this.articleSlug == undefined) {
        return;
      }

      this.viewType = this.route.snapshot.queryParams[QueryParamNames.viewType];
      if (this.viewType == undefined) {
        this.viewType = ViewType.content;
      }
      if (this.viewType == ViewType.historyView) {
        this.articleVersion = this.route.snapshot.queryParams[QueryParamNames.articleVersion];
        if (this.articleVersion == undefined) {
          throw new Error("If view type is historyView then articleVersion query param should be specified");
        }
      }

      this.workspaceViewService.article.subscribe(article => {
        this.article = article;
        this.articleBehaviorSubject.next(this.article);
        if (this.viewType == ViewType.content) {
          this.articleService.articlesIdContentGet(this.article!.id, 'body')
            .subscribe(result => {
              this.articleContent = result;
              this.articlePlaceholder.nativeElement.innerHTML = result.text;
            })
        } else if (this.viewType == ViewType.historyView) {
          this.articleVersionService.articleVersionsIdContentGet(this.articleVersion!, 'response')
            .pipe(catchError((error: HttpErrorResponse) => {
                this.router.navigate([errorToRoute(errorToEnum(error.status))]);
                return EMPTY;
              }),
              map(res => res.body!))
            .subscribe(result => {
              this.articleContent = result;
              this.articlePlaceholder.nativeElement.innerHTML = result.text;
            })
        }
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UpdateArticleDialogComponent, {
      data: {name: this.article!.name, accessRule: this.article!.globalAccessRule, slug: this.article!.slug},
    });

    dialogRef.afterClosed().subscribe((result: UpdateArticleDialogData) => {
      if (result == undefined) {
        return;
      }
      this.articleService.articlesPut(this.article!.id,
        {
          globalAccessRule: result.accessRule,
          name: result.name,
          slug: this.article!.slug
        },
        'response')
        .pipe(catchError((error: HttpErrorResponse) => {
            this.workspaceViewService.errorSubject?.next(errorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(_ => {
          this.router.navigate([`view/${this.workspaceSlug}/${result.slug}`]);
        });
    });
  }

}
