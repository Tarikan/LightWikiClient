import {Injectable} from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams,
  HttpResponse, HttpEvent, HttpUrlEncodingCodec
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {CollectionResult} from "../shared/models/collection-result";
import {ArticleVersion} from "../shared/models/articles/article-version";
import {environment} from "../../environments/environment";
import {ArticleContent} from "../shared/models/articles/article-content";

@Injectable({
  providedIn: 'root'
})
export class ArticleVersionService {
  private defaultHeaders: HttpHeaders = new HttpHeaders();

  constructor(protected httpClient: HttpClient) {
  }

  /**
   *
   *
   * @param articleId
   * @param filters
   * @param sorts
   * @param page
   * @param pageSize
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public articleVersionsGet(articleId: number, filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean): Observable<CollectionResult<ArticleVersion>>;
  public articleVersionsGet(articleId: number, filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CollectionResult<ArticleVersion>>>;
  public articleVersionsGet(articleId: number, filters?: string, sorts?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CollectionResult<ArticleVersion>>>;
  public articleVersionsGet(articleId: number, filters?: string, sorts?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (articleId === null || articleId === undefined) {
      throw new Error('Required parameter articleId was null or undefined when calling articleVersionsGet.');
    }

    let queryParameters = new HttpParams({encoder: new HttpUrlEncodingCodec()});
    queryParameters = queryParameters.set('ArticleId', articleId);
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

    // to determine the Accept header
    return this.httpClient.request<CollectionResult<ArticleVersion>>('get', `${environment.baseUrl}/article-versions`,
      {
        params: queryParameters,
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
  public articleVersionsIdContentGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ArticleContent>;
  public articleVersionsIdContentGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ArticleContent>>;
  public articleVersionsIdContentGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ArticleContent>>;
  public articleVersionsIdContentGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling articleVersionsIdContentGet.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    return this.httpClient.request<ArticleContent>('get', `${environment.baseUrl}/article-versions/${encodeURIComponent(String(id))}/content`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
