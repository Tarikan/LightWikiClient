import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SignUpComponent} from "./core/auth/sign-up/sign-up.component";
import {SignInComponent} from "./core/auth/sign-in/sign-in.component";
import {NoAuthGuard} from "./core/guards/no-auth.guard";
import {ErrorComponent} from "./core/components/error/error.component";
import {NotFoundComponent} from "./core/components/not-found/not-found.component";
import {ForbiddenComponent} from "./core/components/forbidden/forbidden.component";

const routes: Routes = [
  {path: 'error', component: ErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'forbidden', component: ForbiddenComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '', redirectTo: '/workspaces', pathMatch: 'full'},
  {path: 'sign-up', component: SignUpComponent, canActivate: [NoAuthGuard]},
  {path: 'sign-in', component: SignInComponent, canActivate: [NoAuthGuard]},
  {
    path: 'workspaces',
    loadChildren: () => import('./workspace-list/workspace-list.module').then(m => m.WorkspaceListModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./workspace-view/workspace-view.module').then(m => m.WorkspaceViewModule)
  },
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
