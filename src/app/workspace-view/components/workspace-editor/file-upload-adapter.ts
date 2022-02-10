import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../core/auth/auth.service";

export class MyUploadAdapter {
  loader: any;
  xhr: any;
  articleId: number;
  authService: AuthService;

  constructor( loader: any, articleId: number, authService: AuthService ) {
    this.loader = loader;
    this.articleId = articleId;
    this.authService = authService;
  }
  upload() {
    return this.loader.file
      .then( (file: any) => new Promise( ( resolve, reject ) => {
        this._initRequest();
        this._initListeners( resolve, reject, file );
        this._sendRequest( file );
      } ) );
  }
  abort() {
    if ( this.xhr ) {
      this.xhr.abort();
    }
  }
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open( 'POST', `${environment.baseUrl}/articles/${this.articleId}/image`, true );
    xhr.responseType = 'json';
    xhr.setRequestHeader("Accept", "application/json");
  }
  _initListeners( resolve: any, reject: any, file: any ) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${ file.name }.`;
    xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    xhr.addEventListener( 'abort', () => reject() );
    xhr.addEventListener( 'load', () => {
      const response = xhr.response;
      if ( !response || response.error ) {
        return reject( response && response.error ? response.error.message : genericErrorText );
      }
      console.log(response.urls)
      resolve( {
        urls: response.urls
      } );
    } );
    if ( xhr.upload ) {
      xhr.upload.addEventListener( 'progress', (evt: any) => {
        if ( evt.lengthComputable ) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      } );
    }
  }
  _sendRequest( file: any ) {
    const data = new FormData();
    this.xhr.setRequestHeader('Authorization', `Bearer ${this.authService.getIdToken()}`);
    data.append( 'file', file );
    this.xhr.send( data );
  }
}
