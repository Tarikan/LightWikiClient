import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {WorkspaceEditorComponent} from "./components/workspace-editor/workspace-editor.component";

const routes: Routes = [
  {path: '', redirectTo: '/workspaces', pathMatch: 'full'},
  {path: ':workspace_slug/:article_slug', component: WorkspaceComponent, pathMatch: 'full'},
  {path: ':workspace_slug/:article_slug/edit', component: WorkspaceEditorComponent, pathMatch: 'full'},
  {path: ':workspace_slug', component: WorkspaceComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceViewRoutingModule { }
