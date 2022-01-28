import {Component, EventEmitter, OnInit} from '@angular/core';
import {WorkspaceService} from "../../../api/workspace.service";
import {Workspace} from "../../../shared/models/workspaces/workspace";
import {PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public IsLoading : boolean = false;
  public Workspaces: Array<Workspace> = [];
  public PageSize: number = 10;
  public Length: number = 0;

  constructor(private workspaceService: WorkspaceService, private router: Router) {
    this.IsLoading = true;
    workspaceService.workspacesGet(undefined, undefined, 1, this.PageSize)
      .subscribe(x => {
        this.Length = x.total;
        this.Workspaces = x.collection;
        this.IsLoading = false;
      },e => {
        console.log(e)
        this.router.navigate(['/error'])
      });
  }

  ngOnInit(): void {
  }

  onPaginatorUpdate(event: PageEvent): void {
    this.IsLoading = true;
    this.PageSize = event.pageSize;
    this.workspaceService
      .workspacesGet(undefined, undefined, event.pageIndex + 1, this.PageSize)
      .subscribe(x => {
        this.Length = x.total;
        this.Workspaces = x.collection;
        this.IsLoading = false;
      });
  }

  onWorkspaceClick(slug: string)
  {
    this.router.navigate([`view/${slug}`])
  }
}
