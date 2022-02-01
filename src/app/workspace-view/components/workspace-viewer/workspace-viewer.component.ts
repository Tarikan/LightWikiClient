import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {catchError, EMPTY, map, Observable, Subject, tap} from "rxjs";
import {ArticleService} from "../../../api/article.service";
import {Article} from "../../../shared/models/articles/article";
import {ArticleContent} from "../../../shared/models/articles/article-content";
import {Errors, ErrorToEnum} from "../../../core/enums/errors";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-workspace-viewer',
  templateUrl: './workspace-viewer.component.html',
  styleUrls: ['./workspace-viewer.component.css']
})
export class WorkspaceViewerComponent implements AfterViewInit {
  public article: Article | undefined;
  private articleContent: ArticleContent | undefined;

  constructor(private articleService: ArticleService) {
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
            this.errorSubject?.next(ErrorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(result => {
          this.article = result;
          this.articleService.articlesIdContentGet(this.article!.id, 'body')
            .subscribe(result => {
              this.articleContent = result;
              this.articlePlaceholder.nativeElement.innerHTML = result.text;
            })
        });
    })
  }

}
