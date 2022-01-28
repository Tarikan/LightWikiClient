import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../shared/models/workspaces/workspace";
import {CollectionResult} from "../shared/models/collection-result";
import {environment} from "../../environments/environment";
import {ArticleHeader} from "../shared/models/articles/article-header";
import {Success} from "../shared/models/success";
import {WorkspaceInfo} from "../shared/models/workspaces/workspace-info";
import {SuccessWithId} from "../shared/models/success-with-id";
import {CreateWorkspace} from "./requests/workspaces/create-workspace";
import {UpdateWorkspace} from "./requests/workspaces/update-workspace";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private defaultHeaders : HttpHeaders = new HttpHeaders();

  constructor(protected httpClient: HttpClient) { }

  public workspacesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean): Observable<CollectionResult<Workspace>>;
  public workspacesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CollectionResult<Workspace>>>;
  public workspacesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CollectionResult<Workspace>>>;
  public workspacesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
    let queryParameters = new HttpParams();
    if (filters !== undefined && filters !== null) {
      queryParameters = queryParameters.set('Filters', <any>filters);
    }
    if (sorts !== undefined && sorts !== null) {
      queryParameters = queryParameters.set('Sorts', <any>sorts);
    }
    if (page !== undefined && page !== null) {
      queryParameters = queryParameters.set('Page', <any>page);
    }
    if (pageSize !== undefined && pageSize !== null) {
      queryParameters = queryParameters.set('PageSize', <any>pageSize);
    }

    return this.httpClient.request<CollectionResult<Workspace>>('get',`${environment.baseUrl}/workspaces`,
      {
        params: queryParameters,
        withCredentials: false,
        headers: undefined,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public workspacesTreeGet(workspaceId: number, parentArticleId?: number, observe?: 'body', reportProgress?: boolean): Observable<CollectionResult<ArticleHeader>>;
  public workspacesTreeGet(workspaceId: number, parentArticleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CollectionResult<ArticleHeader>>>;
  public workspacesTreeGet(workspaceId: number, parentArticleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CollectionResult<ArticleHeader>>>;
  public workspacesTreeGet(workspaceId: number, parentArticleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
    let queryParameters = new HttpParams({encoder: new HttpUrlEncodingCodec()});
    if (workspaceId !== undefined && workspaceId !== null) {
      queryParameters = queryParameters.set('WorkspaceId', <any>workspaceId);
    }
    if (parentArticleId !== undefined && parentArticleId !== null) {
      queryParameters = queryParameters.set('ParentArticleId', <any>parentArticleId);
    }

    return this.httpClient.request<CollectionResult<ArticleHeader>>('get', `${environment.baseUrl}/workspaces/tree`,
      {
        params: queryParameters,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public workspacesIdDelete(id: number, observe?: 'body', reportProgress?: boolean): Observable<Success>;
  public workspacesIdDelete(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Success>>;
  public workspacesIdDelete(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Success>>;
  public workspacesIdDelete(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling workspacesIdDelete.');
    }



    return this.httpClient.request<Success>('delete',`${environment.baseUrl}/workspaces/${encodeURIComponent(String(id))}`,
      {
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public workspacesIdInfoGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<WorkspaceInfo>;
  public workspacesIdInfoGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<WorkspaceInfo>>;
  public workspacesIdInfoGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<WorkspaceInfo>>;
  public workspacesIdInfoGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling workspacesIdInfoGet.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json'
    ];

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.request<WorkspaceInfo>('get',`${environment.baseUrl}/workspaces/${encodeURIComponent(String(id))}/info`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public workspacesPost(body?: CreateWorkspace, observe?: 'body', reportProgress?: boolean): Observable<SuccessWithId<number>>;
  public workspacesPost(body?: CreateWorkspace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<SuccessWithId<number>>>;
  public workspacesPost(body?: CreateWorkspace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<SuccessWithId<number>>>;
  public workspacesPost(body?: CreateWorkspace, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json'
    ];

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json-patch+json',
      'application/json',
      'text/json',
      'application/_*+json'
    ];

    return this.httpClient.request<SuccessWithId<number>>('post',`${environment.baseUrl}/workspaces`,
      {
        body: body,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public workspacesPut(body?: UpdateWorkspace, observe?: 'body', reportProgress?: boolean): Observable<Success>;
  public workspacesPut(body?: UpdateWorkspace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Success>>;
  public workspacesPut(body?: UpdateWorkspace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Success>>;
  public workspacesPut(body?: UpdateWorkspace, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json'
    ];

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json-patch+json',
      'application/json',
      'text/json',
      'application/_*+json'
    ];

    return this.httpClient.request<Success>('put',`${environment.baseUrl}/workspaces`,
      {
        body: body,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param slug
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getWorkspaceBySlug(slug: string, observe?: 'body', reportProgress?: boolean): Observable<Workspace>;
  public getWorkspaceBySlug(slug: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Workspace>>;
  public getWorkspaceBySlug(slug: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Workspace>>;
  public getWorkspaceBySlug(slug: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (slug === null || slug === undefined) {
      throw new Error('Required parameter slug was null or undefined when calling getWorkspaceBySlug.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json'
    ];

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.request<Workspace>('get',`${environment.baseUrl}/workspaces/slug/${encodeURIComponent(String(slug))}`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
