import {Component, Input, OnInit} from '@angular/core';
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {ArticleHeader} from "../../../shared/models/articles/article-header";
import {map, Observable, tap} from "rxjs";
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

    var children = this.dataSource.data.filter(n => n.parentId == node.id);
    if (node.hasChildren && children.length > 0) {
      return children;
    }

    return this.workspaceService.workspacesTreeGet(this.workspace!.id, node.id, 'body')
      .pipe(
        map(x => x.collection),
        tap(res => {
          res.forEach(e => e.parentId == node.parentId);
          this.dataSource.data.push(...res);
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

    this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'body')
      .subscribe(result => {
        this.dataSource.data = result.collection;
        let selected = this.dataSource.data.find(h => h.slug == this.articleSlug);
        if (selected == null && !this.isInitialized) {
          this.articleService.getArticleBySlugs(this.workspace!.slug, this.articleSlug, 'body')
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
    if (pos > nodes.length) {
      return;
    }

    let col = this.getChildren(root);
    this.treeControl.expand(this.dataSource.data.find(e => e.id == root.id)!);

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
        .subscribe(res => {
          this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'body')
            .subscribe(result => {
              this.dataSource.data = result.collection;
            });
        });
    });
  }

}
