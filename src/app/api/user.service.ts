import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, map, Observable} from "rxjs";
import {User} from "../shared/models/users/user";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpUrlEncodingCodec
} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ResponsiveImage} from "../shared/models/images/responsiveImage";
import {AuthService} from "../core/auth/auth.service";
import {errorToRoute} from "../app-routing.module";
import {errorToEnum} from "../core/enums/errors";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private defaultHeaders: HttpHeaders = new HttpHeaders();
  private userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  private userId: number | undefined;
  public isLoading = true;
  public user = this.userSubject.asObservable();

  constructor(protected httpClient: HttpClient, private authService: AuthService, private router: Router) {
    this.authService.userId.subscribe(id => {
      this.isLoading = true;
      this.userId = id;
      if (id == undefined)
      {
        this.userSubject.next(undefined);
        return;
      }

      this.resetCurrentUser();
    })
  }

  public resetCurrentUser() {
    this.getUserById(this.userId!, 'response')
      .pipe(catchError((error: HttpErrorResponse) => {
          this.router.navigate([errorToRoute(errorToEnum(error.status))]);
          return EMPTY;
        }),
        map(res => res.body!))
      .subscribe(res => {
        this.userSubject.next(res);
      })
  }

  public getUserById(id: number, observe?: 'body', reportProgress?: boolean): Observable<User>;
  public getUserById(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
  public getUserById(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
  public getUserById(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdContentGet.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<User>('get', `${environment.baseUrl}/users/${encodeURIComponent(String(id))}/content`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public usersAvatarPostForm(file?: Blob, observe?: 'body', reportProgress?: boolean): Observable<ResponsiveImage>;
  public usersAvatarPostForm(file?: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsiveImage>>;
  public usersAvatarPostForm(file?: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsiveImage>>;
  public usersAvatarPostForm(file?: Blob, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;

    const consumes: string[] = [
      'multipart/form-data'
    ];

    const canConsumeForm = this.canConsumeForm(consumes);

    let formParams: { append(param: string, value: any): void; };
    let useForm: boolean;
    let convertFormParamsToString = false;
    // use FormData to transmit files using content-type "multipart/form-data"
    // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
    useForm = canConsumeForm;
    if (useForm) {
      formParams = new FormData();
    } else {
      formParams = new HttpParams({encoder: new HttpUrlEncodingCodec()});
    }

    if (file !== undefined) {
      formParams = formParams.append('file', <any>file) as any || formParams;
    }

    return this.httpClient.request<ResponsiveImage>('post', `${environment.baseUrl}/users/avatar`,
      {
        body: convertFormParamsToString ? formParams.toString() : formParams,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  private static canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }
}
