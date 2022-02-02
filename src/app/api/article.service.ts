import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article} from "../shared/models/articles/article";
import {environment} from "../../environments/environment";
import {CollectionResult} from "../shared/models/collection-result";
import {ArticleContent} from "../shared/models/articles/article-content";
import {UpdateArticleContent} from "./requests/articles/update-article-content";
import {Success} from "../shared/models/success";
import {CreateArticle} from "./requests/articles/create-article";
import {UpdateArticle} from "./requests/articles/update-article";
import {ArticleAncestors} from "../shared/models/articles/article-ancestors";
import {SuccessWithId} from "../shared/models/success-with-id";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private defaultHeaders: HttpHeaders = new HttpHeaders();

  constructor(protected httpClient: HttpClient) {
  }

  public getArticleBySlugs(workspaceSlug: string, articleNameSlug: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public getArticleBySlugs(workspaceSlug: string, articleNameSlug: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public getArticleBySlugs(workspaceSlug: string, articleNameSlug: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public getArticleBySlugs(workspaceSlug: string, articleNameSlug: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (workspaceSlug === null || workspaceSlug === undefined) {
      throw new Error('Required parameter workspaceSlug was null or undefined when calling getArticleBySlugs.');
    }

    if (articleNameSlug === null || articleNameSlug === undefined) {
      throw new Error('Required parameter articleNameSlug was null or undefined when calling getArticleBySlugs.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<any>('get', `${environment.baseUrl}/articles/display/${encodeURIComponent(String(workspaceSlug))}/${encodeURIComponent(String(articleNameSlug))}`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param filters
   * @param sorts
   * @param page
   * @param pageSize
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articlesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean): Observable<CollectionResult<Article>>;
  public articlesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CollectionResult<Article>>>;
  public articlesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CollectionResult<Article>>>;
  public articlesGet(filters?: string, sorts?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let queryParameters = new HttpParams({encoder: new HttpUrlEncodingCodec()});
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

    let headers = this.defaultHeaders;

    return this.httpClient.request<CollectionResult<Article>>('get', `${environment.baseUrl}/articles`,
      {
        params: queryParameters,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public articlesIdContentGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ArticleContent>;
  public articlesIdContentGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ArticleContent>>;
  public articlesIdContentGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ArticleContent>>;
  public articlesIdContentGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdContentGet.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<ArticleContent>('get', `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}/content`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param id
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articlesIdContentPost(id: number, body?: UpdateArticleContent, observe?: 'body', reportProgress?: boolean): Observable<Success>;
  public articlesIdContentPost(id: number, body?: UpdateArticleContent, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Success>>;
  public articlesIdContentPost(id: number, body?: UpdateArticleContent, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Success>>;
  public articlesIdContentPost(id: number, body?: UpdateArticleContent, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdContentPost.');
    }


    let headers = this.defaultHeaders;

    return this.httpClient.request<Success>('post', `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}/content`,
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
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articlesIdDelete(id: number, observe?: 'body', reportProgress?: boolean): Observable<Success>;
  public articlesIdDelete(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Success>>;
  public articlesIdDelete(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Success>>;
  public articlesIdDelete(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdDelete.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<Success>('delete', `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articlesIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<Article>;
  public articlesIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Article>>;
  public articlesIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Article>>;
  public articlesIdGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdGet.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<Article>('get', `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}`,
      {
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
  public articlesPost(body?: CreateArticle, observe?: 'body', reportProgress?: boolean): Observable<SuccessWithId<number>>;
  public articlesPost(body?: CreateArticle, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<SuccessWithId<number>>>;
  public articlesPost(body?: CreateArticle, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<SuccessWithId<number>>>;
  public articlesPost(body?: CreateArticle, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    return this.httpClient.request<Success>('post', `${environment.baseUrl}/articles`,
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
   * @param id
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articlesPut(id: number, body?: UpdateArticle, observe?: 'body', reportProgress?: boolean): Observable<Success>;
  public articlesPut(id: number, body?: UpdateArticle, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Success>>;
  public articlesPut(id: number, body?: UpdateArticle, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Success>>;
  public articlesPut(id: number, body?: UpdateArticle, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdGet.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<Success>('put', `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}`,
      {
        body: body,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public getArticleAncestors(id: number, observe?: 'body', reportProgress?: boolean): Observable<ArticleAncestors>;
  public getArticleAncestors(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ArticleAncestors>>;
  public getArticleAncestors(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ArticleAncestors>>;
  public getArticleAncestors(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articlesIdGet.');
    }

    let headers = this.defaultHeaders;

    return this.httpClient.request<Article>(
      'get',
      `${environment.baseUrl}/articles/${encodeURIComponent(String(id))}/ancestors`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
