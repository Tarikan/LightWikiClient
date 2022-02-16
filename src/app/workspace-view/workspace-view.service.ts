import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivationEnd, Router} from "@angular/router";
import {ArticleService} from "../api/article.service";
import {WorkspaceService} from "../api/workspace.service";
import {
  BehaviorSubject,
  catchError,
  EMPTY, filter,
  forkJoin,
  map,
  Observable,
  ReplaySubject,
  tap
} from "rxjs";
import {Article} from "../shared/models/articles/article";
import {Workspace} from "../shared/models/workspaces/workspace";
import {QueryParamNames} from "./query-param-names";
import {HttpErrorResponse} from "@angular/common/http";
import {Errors, errorToEnum} from "../core/enums/errors";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceViewService {
  private readonly isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly articleSubject: ReplaySubject<Article> = new ReplaySubject<Article>();
  private readonly workspaceSubject: ReplaySubject<Workspace> = new ReplaySubject<Workspace>();
  private workspaceSlug: string = '';
  private articleSlug: string = '';
  private _articleSnapshot: Article | undefined;
  private _workspaceSnapshot: Workspace | undefined;
  private _isLoadingSnapshot: boolean = true;

  public readonly isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();
  public readonly article: Observable<Article | undefined> = this.articleSubject.asObservable();
  public readonly workspace: Observable<Workspace | undefined> = this.workspaceSubject.asObservable();
  public readonly errorSubject: BehaviorSubject<Errors | undefined> = new BehaviorSubject<Errors | undefined>(undefined);

  public get articleSnapshot(): Article | undefined {
    return this._articleSnapshot;
  }

  public get workspaceSnapshot(): Workspace | undefined {
    return this._workspaceSnapshot;
  }

  public get isLoadingSnapshot(): boolean {
    return this._isLoadingSnapshot;
  }

  private set articleSnapshot(article: Article | undefined) {
    this._articleSnapshot = article;
  }

  private set workspaceSnapshot(workspace: Workspace | undefined) {
    this._workspaceSnapshot = workspace;
  }

  private set isLoadingSnapshot(isLoading: boolean) {
    this._isLoadingSnapshot = isLoading;
  }

  constructor(private router: Router,
              private articleService: ArticleService,
              private workspaceService: WorkspaceService) {
  }

  public onSlugsChange(workspaceSlug: string, articleSlug: string): void {
    this.isLoadingSubject.next(true);
    this.isLoadingSnapshot = true;

    if (workspaceSlug == undefined) {
      this.isLoadingSnapshot = false;
      this.isLoadingSubject.next(false);
      throw new Error('Workspace slug is undefined');
    }

    const oldWorkspaceSlug = this.workspaceSlug;

    this.workspaceSlug = workspaceSlug;
    this.articleSlug = articleSlug;

    if (this.articleSlug == undefined) {
      this.refreshWorkspace()
        .subscribe(next => {
          this.router.navigate([`view/${this.workspaceSlug}/${next.workspaceRootArticleSlug}`]);
        })
      return;
    }

    if (oldWorkspaceSlug === this.workspaceSlug) {
      this.refreshArticle()
        .subscribe(next => {
          this.isLoadingSubject.next(false);
          this.isLoadingSnapshot = false;
        });
    } else {
      forkJoin([
        this.refreshArticle(),
        this.refreshWorkspace(),
      ])
        .subscribe((next) => {
          this.isLoadingSubject.next(false);
          this.isLoadingSnapshot = false;
        })
    }
  }

  refreshArticle(): Observable<Article> {
    return this.articleService.getArticleBySlugs(this.workspaceSlug, this.articleSlug, 'response')
      .pipe(catchError((error: HttpErrorResponse) => {
          this.errorSubject?.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!),
        tap(next => {
          this.articleSubject.next(next);
          this.articleSnapshot = next;
        })
      );
  }

  refreshWorkspace(): Observable<Workspace> {
    return this.workspaceService.getWorkspaceBySlug(this.workspaceSlug, 'response')
      .pipe(catchError((error: HttpErrorResponse) => {
          this.errorSubject?.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!),
        tap(next => {
          this.workspaceSubject.next(next);
          this.workspaceSnapshot = next;
        })
      );
  }
}
