import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {ArticleHeader} from "../../../shared/models/articles/article-header";
import {map, Observable, tap} from "rxjs";
import {WorkspaceService} from "../../../api/workspace.service";
import {Router} from "@angular/router";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";

@Component({
  selector: 'app-workspace-tree',
  templateUrl: './workspace-tree.component.html',
  styleUrls: ['./workspace-tree.component.css']
})
export class WorkspaceTreeComponent implements OnInit {
  public articleTree: Array<ArticleHeader> = [];
  public dataSource: MatTreeNestedDataSource<ArticleHeader> = new MatTreeNestedDataSource<ArticleHeader>();
  public treeControl = new NestedTreeControl<ArticleHeader>(this.getChildren.bind(this));
  public workspace: Workspace | undefined;
  public selectedHeader : ArticleHeader | undefined;

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router) {
  }

  @Input('selectedComponentId') selectedComponentId: number | undefined;
  @Input('workspaceObservable') workspaceObservable!: Observable<Workspace | undefined>;

  ngOnInit(): void {
    this.workspaceObservable.subscribe(next => {
      if (next == undefined)
      {
        return;
      }
      this.onWorkspaceEventEmitted.bind(this)(next);
    });
  }

  getChildren(node: ArticleHeader): Array<ArticleHeader> | Observable<ArticleHeader[]> {
    if (!node.hasChildren) {
      return [];
    }

    if (node.hasChildren && node.children) {
      return node.children;
    }

    return this.workspaceService.workspacesTreeGet(this.workspace!.id, node.id, 'body')
      .pipe(
        tap(res => node.children = res.collection),
        map(x => x.collection));
  }

  hasChild(num: number, node: ArticleHeader): boolean {
    return node.hasChildren;
  }

  onNodeClick(node: ArticleHeader): void {
    this.selectedHeader = node;
    this.router.navigate([`view/${this.workspace!.slug}/${node.slug}`])
  }

  onRootNodeClick(): void {
    this.router.navigate([`view/${this.workspace!.slug}/${this.workspace!.workspaceRootArticleSlug}`])
  }

  private onWorkspaceEventEmitted(workspace: Workspace): void {
    this.workspace = workspace;
    this.workspaceService.workspacesTreeGet(this.workspace!.id, undefined, 'body')
      .subscribe(result => {
        this.dataSource.data = result.collection;
      });
  }

}
