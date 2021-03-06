import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Article} from "../../../shared/models/articles/article";
import {catchError, EMPTY, map, Observable} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ArticleVersion} from "../../../shared/models/articles/article-version";
import {ArticleVersionService} from "../../../api/article-version.service";
import {HttpErrorResponse} from "@angular/common/http";
import {errorToEnum} from "../../../core/enums/errors";
import {errorToRoute} from "../../../app-routing.module";
import {QueryParamNames} from "../../query-param-names";
import {getSrcSetFromImage} from "../../../shared/models/images/image";

@Component({
  selector: 'app-versions-view',
  templateUrl: './versions-view.component.html',
  styleUrls: ['./versions-view.component.css']
})
export class VersionsViewComponent implements OnInit {
  public versions: ArticleVersion[] = [];
  public versionsCount: number = 0
  public pageSize: number = 10;
  public isLoading: boolean = true;
  private article: Article | undefined;
  private workspaceSlug: string | undefined;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private articleVersionService: ArticleVersionService) {
  }

  @Input('article') articleObservable: Observable<Article | undefined> | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.workspaceSlug = params[QueryParamNames.workspaceSlug];
    })
    this.articleObservable?.subscribe(next => {
      if (next == undefined) {
        return;
      }
      this.article = next;
      this.onPaginatorUpdate({length: 0, pageIndex: 0, pageSize: this.pageSize})
    });
  }

  navigateToVersionView(id: number) {
    this.router.navigate([`view/${this.workspaceSlug!}/${this.article!.slug}`], {
      queryParams: {
        [QueryParamNames.viewType]: 'historyView',
        [QueryParamNames.articleVersion]: id,
      }
    })
  }

  onPaginatorUpdate(event: PageEvent) {
    this.isLoading = true;
    this.articleVersionService.articleVersionsGet(this.article!.id, undefined, undefined, event.pageIndex + 1, event.pageSize, 'response')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.router.navigate([errorToRoute(errorToEnum(error.status))]);
          return EMPTY;
        }),
        map(res => res.body!))
      .subscribe(x => {
        this.versionsCount = x.total;
        this.versions = x.collection;
        this.isLoading = false;
      });
  }

  getSrcSet(version: ArticleVersion): string[] {
    return getSrcSetFromImage(version.user.avatar);
  }

  getJdenticonValueForUser(id: number): string {
    return `user-${id}`;
  }
}
