import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiModule} from "../api/api.module";
import {ListPageComponent} from './components/list-page/list-page.component';
import {MatListModule} from "@angular/material/list";
import {WorkspaceListRoutingModule} from './workspace-list-routing.module';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    MatListModule,
    WorkspaceListRoutingModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})
export class WorkspaceListModule {
}
