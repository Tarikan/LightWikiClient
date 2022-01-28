import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CognitoUserPool} from "amazon-cognito-identity-js";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {
  }

  isLoggedIn(): boolean {
    var isAuth = false;

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid();
      })
    }
    return isAuth;
  }

  logout(): void {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate(["sign-in"])
  }

  getIdToken(): string | null {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser == null) {
      return null;
    }

    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
      }
    })

    var session = cognitoUser.getSignInUserSession();

    if (session == null) {
      return null;
    }

    return session.getIdToken().getJwtToken();
  }

  getAccessToken(): string | null {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser == null) {
      return null;
    }

    var session = cognitoUser.getSignInUserSession();

    if (session == null) {
      return null;
    }

    return session.getAccessToken().getJwtToken();
  }
}
