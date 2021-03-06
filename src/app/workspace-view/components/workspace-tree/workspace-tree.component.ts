import {Component, Input, OnInit} from '@angular/core';
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {ArticleHeader} from "../../../shared/models/articles/article-header";
import {BehaviorSubject, catchError, EMPTY, map, Observable, Subject, tap} from "rxjs";
import {WorkspaceService} from "../../../api/workspace.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {WorkspaceAccessRule} from "../../../shared/enums/workspace-access-rule";
import {MatDialog} from "@angular/material/dialog";
import {
  CreateArticleDialogComponent,
  CreateArticleDialogData
} from "../create-article-dialog/create-article-dialog.component";
import {ArticleService} from "../../../api/article.service";
import {errorToEnum} from "../../../core/enums/errors";
import {HttpErrorResponse} from "@angular/common/http";
import {QueryParamNames} from "../../query-param-names";
import {WorkspaceViewService} from "../../workspace-view.service";

@Component({
  selector: 'app-workspace-tree',
  templateUrl: './workspace-tree.component.html',
  styleUrls: ['./workspace-tree.component.css']
})
export class WorkspaceTreeComponent implements OnInit {
  public isInitialized = false;
  public articleTree: Array<ArticleHeader> = [];
  public dataSource: MatTreeNestedDataSource<ArticleHeader> = new MatTreeNestedDataSource<ArticleHeader>();
  public treeControl = new NestedTreeControl<ArticleHeader>(this.getChildren.bind(this));
  public workspace: Workspace | undefined;
  public articleSlug: string = '';
  public canCreateArticle: boolean = false;
  public selectedComponentId: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public dialog: MatDialog,
    private workspaceViewService: WorkspaceViewService) {
  }

  @Input('workspaceObservable') workspaceObservable!: Observable<Workspace | undefined>;

  ngOnInit(): void {
    this.route.params.subscribe(next => {
      this.articleSlug = next[QueryParamNames.articleSlug];
    });

    this.workspaceObservable.subscribe(next => {
      if (next == undefined) {
        return;
      }
      this.onWorkspaceEventEmitted.bind(this)(next);
    });
  }

  getChildren(node: ArticleHeader): Array<ArticleHeader> | Observable<ArticleHeader[]> {
    if (!node.hasChildren) {
      return [];
    }

    let children = this.dataSource.data.filter(n => n.parentArticleId == node.id);
    //console.log(node, children.length)
    if (node.hasChildren && children.length > 0) {
      return children;
    }

    return this.workspaceService.workspacesTreeGet(this.workspace!.id, node.id, 'response')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.workspaceViewService.errorSubject.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!.collection),
        tap(res => {
          this.dataSource.data.push(...res)
        }),
        map(res => {
          return res.filter(a => a.parentArticleId == node.id);
        }));
  }

  hasChild(num: number, node: ArticleHeader): boolean {
    return node.hasChildren;
  }

  onNodeClick(node: ArticleHeader): void {
    this.selectedComponentId.next(node.id);
    this.router.navigate([`view/${this.workspace!.slug}/${node.slug}`])
  }

  onRootNodeClick(): void {
    this.selectedComponentId.next(undefined);
    this.router.navigate([`view/${this.workspace!.slug}/${this.workspace!.workspaceRootArticleSlug}`])
  }

  private onWorkspaceEventEmitted(workspace: Workspace): void {
    this.dataSource.data = [];
    this.workspace = workspace;

    this.canCreateArticle =
      workspace.workspaceAccessRuleForCaller && WorkspaceAccessRule.createArticle == WorkspaceAccessRule.createArticle;

    this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'response')
      .pipe(catchError((error: HttpErrorResponse) => {
          this.workspaceViewService.errorSubject.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!),)
      .subscribe(result => {
        this.dataSource.data = result.collection.filter(a => a.parentArticleId == null);
        let selected = this.dataSource.data.find(h => h.slug == this.articleSlug);
        if ((selected === null || selected === undefined) && !this.isInitialized && this.workspace?.workspaceRootArticleSlug != this.articleSlug) {
          this.articleService.getArticleBySlugs(this.workspace!.slug, this.articleSlug, 'response')
            .pipe(catchError((error: HttpErrorResponse) => {
                this.workspaceViewService.errorSubject.next(errorToEnum(error.status))
                return EMPTY;
              }),
              map(res => res.body!),)
            .subscribe(article => {

              this.selectedComponentId.next(article.id);
              this.articleService.getArticleAncestors(article.id, 'body')
                .subscribe(ancestors => {
                  let col = this.dataSource.data;
                  let root = col.find(a => a.id == ancestors.articleAncestors[0]);
                  this.recursiveExpandTree(root!, ancestors.articleAncestors, 1);
                })
            })
        } else {
          this.selectedComponentId.next(selected?.id);
        }
        this.isInitialized = true;
      });
  }

  recursiveExpandTree(root: ArticleHeader, nodes: number[], pos: number) {
    if (root.id == nodes.slice(-1)[0]) {
      for (let i = 0; i < nodes.length; i++) {
        this.treeControl.expand(this.dataSource.data.find(n => n.id == nodes[i])!)
      }
    }

    if (pos >= nodes.length) {
      return;
    }

    let col = this.getChildren(root);

    if ('subscribe' in col) {
      col.subscribe(
        res => {
          this.recursiveExpandTree((res.find(e => e.id == nodes[pos]))!, nodes, pos + 1);
        }
      );
    } else {
      this.recursiveExpandTree(col.find(e => e.id == nodes[pos])!, nodes, pos + 1);
    }
  }

  openDialog(id: number | undefined): void {
    const dialogRef = this.dialog.open(CreateArticleDialogComponent, {
      data: {name: '', animal: ''},
    });

    dialogRef.afterClosed().subscribe((result: CreateArticleDialogData) => {
      if (result == undefined) {
        return;
      }
      this.articleService.articlesPost(
        {
          globalAccessRule: result.accessRule,
          name: result.name,
          parentId: id,
          workspaceId: this.workspace!.id
        },
        'response')
        .pipe(catchError((error: HttpErrorResponse) => {
            this.workspaceViewService.errorSubject.next(errorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(res => {
          this.treeControl.collapseAll();
          this.isInitialized = false;

          this.articleService.articlesIdGet(res.id, 'response')
            .pipe(catchError((error: HttpErrorResponse) => {
                this.workspaceViewService.errorSubject.next(errorToEnum(error.status))
                return EMPTY;
              }),
              map(res => res.body!),)
            .subscribe(article => {
              this.router.navigate([`view/${this.workspace!.slug}/${article.slug}`]);
              this.onWorkspaceEventEmitted(this.workspace!);
            })
        });
    });
  }

}
