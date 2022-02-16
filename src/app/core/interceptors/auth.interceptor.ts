import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.authService.getIdToken();
    if (token != null)
    {
      let duplicate = request.clone({headers: request.headers.set("Authorization", "Bearer " + token)});
      return next.handle(duplicate);
    }
    console.log("NO TOKEN")
    return next.handle(request);
  }
}
