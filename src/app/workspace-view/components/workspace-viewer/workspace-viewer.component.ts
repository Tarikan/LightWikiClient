import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, tap} from "rxjs";
import {ArticleService} from "../../../api/article.service";
import {Article} from "../../../shared/models/articles/article";
import {ArticleContent} from "../../../shared/models/articles/article-content";

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

  ngAfterViewInit(): void {
    this.slugs.subscribe(next => {
      if (next[0] == undefined ||
        next[1] == undefined) {
        return;
      }
      this.articleService.getArticleBySlugs(next[0], next[1], 'body')
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
