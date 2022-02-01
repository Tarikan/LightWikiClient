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
import { WorkspaceEditorComponent } from './components/workspace-editor/workspace-editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CreateArticleDialogComponent } from './components/create-article-dialog/create-article-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceTreeComponent,
    WorkspaceViewerComponent,
    WorkspaceEditorComponent,
    CreateArticleDialogComponent
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
    MatDividerModule,
    CKEditorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ]
})
export class WorkspaceViewModule { }
