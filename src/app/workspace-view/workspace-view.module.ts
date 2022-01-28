import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceViewRoutingModule } from './workspace-view-routing.module';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import {CoreModule} from "../core/core.module";
import {MatTreeModule} from "@angular/material/tree";
import {MatButtonModule} from "@angular/material/button";
import {CdkTreeModule} from "@angular/cdk/tree";
import {MatIconModule} from "@angular/material/icon";
import { WorkspaceTreeComponent } from './components/workspace-tree/workspace-tree.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { WorkspaceViewerComponent } from './components/workspace-viewer/workspace-viewer.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";



@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceTreeComponent,
    WorkspaceViewerComponent
  ],
  imports: [
    CommonModule,
    WorkspaceViewRoutingModule,
    CoreModule,
    MatTreeModule,
    MatButtonModule,
    CdkTreeModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class WorkspaceViewModule { }
