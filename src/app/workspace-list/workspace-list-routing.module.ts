import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ListPageComponent} from "./components/list-page/list-page.component";
import {ConfigurableAuthGuard} from "../core/guards/configurable-auth.guard";

const routes: Routes = [
  {path: '', component: ListPageComponent, canActivate: [ConfigurableAuthGuard]},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class WorkspaceListRoutingModule { }
