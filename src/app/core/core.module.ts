import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

import { MatIconModule } from '@angular/material/icon'
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ErrorComponent } from './components/error/error.component';
import { ErrorSwitcherComponent } from './components/error-switcher/error-switcher.component';
import { MaterialElevationDirective } from './directives/material-elevation.directive';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    ForbiddenComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    ErrorComponent,
    ErrorSwitcherComponent,
    MaterialElevationDirective
  ],
  exports: [
    HeaderComponent,
    ErrorComponent,
    ErrorSwitcherComponent,
    MaterialElevationDirective
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterModule,
  ]
})
export class CoreModule { }
