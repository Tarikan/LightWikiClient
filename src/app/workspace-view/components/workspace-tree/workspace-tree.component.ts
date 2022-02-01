import {Component, Input, OnInit} from '@angular/core';
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {ArticleHeader} from "../../../shared/models/articles/article-header";
import {catchError, EMPTY, map, Observable, Subject, tap} from "rxjs";
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
import {Errors, errorToEnum} from "../../../core/enums/errors";
import {HttpErrorResponse} from "@angular/common/http";

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

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public dialog: MatDialog) {
  }

  @Input('selectedComponentId') selectedComponentId: number | undefined;
  @Input('workspaceObservable') workspaceObservable!: Observable<Workspace | undefined>;
  @Input('errorSubject') errorSubject: Subject<Errors> | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(next => {
      this.articleSlug = next['article_slug'];
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
          this.errorSubject?.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!.collection),
        tap(res => {
          //this.dataSource.data.push(...res.filter(r => !this.dataSource.data.find(a => a.id == r.id)));
          //console.log(this.dataSource.data.filter(a => a.parentArticleId == node.id))
          this.dataSource.data.push(...res)
          //console.log(res, node, this.dataSource.data)
        }),
        map(res => {
          return res.filter(a => a.parentArticleId == node.id);
        }));
  }

  hasChild(num: number, node: ArticleHeader): boolean {
    return node.hasChildren;
  }

  onNodeClick(node: ArticleHeader): void {
    this.router.navigate([`view/${this.workspace!.slug}/${node.slug}`])
  }

  onRootNodeClick(): void {
    this.router.navigate([`view/${this.workspace!.slug}/${this.workspace!.workspaceRootArticleSlug}`])
  }

  private onWorkspaceEventEmitted(workspace: Workspace): void {
    this.workspace = workspace;

    this.canCreateArticle =
      workspace.workspaceAccessRuleForCaller && WorkspaceAccessRule.createArticle == WorkspaceAccessRule.createArticle;

    this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'response')
      .pipe(catchError((error: HttpErrorResponse) => {
          this.errorSubject?.next(errorToEnum(error.status))
          return EMPTY;
        }),
        map(res => res.body!),)
      .subscribe(result => {
        this.dataSource.data = result.collection.filter(a => a.parentArticleId == null);
        let selected = this.dataSource.data.find(h => h.slug == this.articleSlug);
        if (selected == null && !this.isInitialized && this.workspace!.workspaceRootArticleSlug != this.articleSlug) {
          this.articleService.getArticleBySlugs(this.workspace!.slug, this.articleSlug, 'response')
            .pipe(catchError((error: HttpErrorResponse) => {
                this.errorSubject?.next(errorToEnum(error.status))
                return EMPTY;
              }),
              map(res => res.body!),)
            .subscribe(article => {
              this.selectedComponentId = article.id;
              this.articleService.getArticleAncestors(article.id, 'body')
                .subscribe(ancestors => {
                  let col = this.dataSource.data;
                  let root = col.find(a => a.id == ancestors.articleAncestors[0]);
                  this.recursiveExpandTree(root!, ancestors.articleAncestors, 1);
                })
            })
        } else {
          this.selectedComponentId = selected!.id;
        }
        this.isInitialized = true;
      });
  }

  recursiveExpandTree(root: ArticleHeader, nodes: number[], pos: number) {
    if (root.id == nodes.slice(-1)[0]) {
      for (let i = 0; i < nodes.length; i++)
      {
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

  openDialog(articleHeader: ArticleHeader): void {
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
          name: result.name, parentId: articleHeader.id,
          workspaceId: this.workspace!.id
        },
        'response')
        .pipe(catchError((error: HttpErrorResponse) => {
            this.errorSubject?.next(errorToEnum(error.status))
            return EMPTY;
          }),
          map(res => res.body!),)
        .subscribe(_ => {
          this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'body')
            .subscribe(result => {
              this.dataSource.data = result.collection;
            });
        });
    });
  }

}
