import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WorkspaceComponent} from "./components/workspace/workspace.component";

const routes: Routes = [
  {path: '', redirectTo: '/workspaces', pathMatch: 'full'},
  {path: ':workspace_slug/:article_slug', component: WorkspaceComponent, pathMatch: 'full'},
  {path: ':workspace_slug', component: WorkspaceComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceViewRoutingModule { }
