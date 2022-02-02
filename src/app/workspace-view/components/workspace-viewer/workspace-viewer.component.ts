import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, map, Observable, Subject} from "rxjs";
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
import {Router} from "@angular/router";

enum ViewType {
  content = 0,
  history = 1,
  access = 2,
}

@Component({
  selector: 'app-workspace-viewer',
  templateUrl: './workspace-viewer.component.html',
  styleUrls: ['./workspace-viewer.component.css']
})
export class WorkspaceViewerComponent implements AfterViewInit {
  public ViewType = ViewType;
  public article: Article | undefined;
  private articleContent: ArticleContent | undefined;
  public viewType: ViewType = ViewType.content;
  public articleBehaviorSubject: BehaviorSubject<Article | undefined> =
    new BehaviorSubject<Article | undefined>(undefined);

  setViewType(viewType: ViewType) : void
  {
    this.viewType = viewType;
  }

  constructor(
    private articleService: ArticleService,
    public dialog: MatDialog,
    private router: Router) {
  }

  @ViewChild('articlePlaceholder') articlePlaceholder!: ElementRef;
  @Input('workspaceSlug') workspaceSlug!: string;
  @Input('articleSlug') articleSlug!: string;
  @Input('workspaceArticleSlugs') slugs!: Observable<[string, string]>;
  @Input('errorSubject') errorSubject: Subject<Errors> | undefined;

  ngAfterViewInit(): void {
    this.slugs.subscribe(next => {
      if (next[0] == undefined ||
        next[1] == undefined) {
        return;
      }
      this.articleService.getArticleBySlugs(next[0], next[1], 'response')
        .pipe(catchError((error: HttpErrorResponse) => {
            this.errorSubject?.next(errorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(result => {
          this.article = result;
          this.articleBehaviorSubject.next(this.article);
          this.articleService.articlesIdContentGet(this.article!.id, 'body')
            .subscribe(result => {
              this.articleContent = result;
              this.articlePlaceholder.nativeElement.innerHTML = result.text;
            })
        });
    })
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
            this.errorSubject?.next(errorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(_ => {
          this.router.navigate([`view/${this.workspaceSlug}/${result.slug}`]);
        });
    });
  }

}
