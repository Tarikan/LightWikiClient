import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from "./core/core.module";
import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxJdenticonModule} from "ngx-jdenticon";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    AppComponent,
    SidePanelComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        AppRoutingModule,
        HttpClientModule,
        MatSidenavModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgxJdenticonModule,
        MatDividerModule,
    ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
