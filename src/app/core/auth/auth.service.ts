import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {AuthenticationDetails, CognitoUser, CognitoUserPool} from "amazon-cognito-identity-js";
import {BehaviorSubject} from "rxjs";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIdSubject: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(this.getCurrentUserId());
  public userId = this.userIdSubject.asObservable();

  constructor(private router: Router) {
  }

  private getCurrentUserId() : number | undefined {
    if (!this.isLoggedIn())
    {
      return undefined;
    }

    const idToken = this.getDeserializedIdToken();

    return idToken['custom:public_id'];
  }

  isLoggedIn(): boolean {
    let isAuth = false;

    const poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

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
    this.userIdSubject.next(undefined);
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate(["sign-in"])
  }

  getIdToken(): string | undefined {
    const poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser == undefined) {
      return undefined;
    }

    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        console.error(err.message || JSON.stringify(err));
      }
    })

    const session = cognitoUser.getSignInUserSession();

    if (session == undefined) {
      return undefined;
    }

    return session.getIdToken().getJwtToken();
  }

  getDeserializedIdToken(): any {
    const token = this.getIdToken();
    if (token == null) {
      return undefined
    }
    return jwt_decode(token);
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

  public SignIn(email: string, password: string, onSuccess: () => void, onFail: (err: any) => void) {
    let authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
      ClientId: environment.cognitoAppClientId // Your client id here
    };

    let userPool = new CognitoUserPool(poolData);
    let userData = { Username: email, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (_) => {
        this.userIdSubject.next(this.getCurrentUserId())
        onSuccess();
      },
      onFailure: (err) => {
        onFail(err);
      },
    });
  }

  public SignUp(email: string, password: string, onSuccess: () => void, onFail: (err: any) => void) {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let attributeList: any[] = [];

    userPool.signUp(email, password, attributeList, [], (
      err,
      _
    ) => {
      if (err) {
        onFail(err);
        return;
      } else {
        onSuccess();
      }
    });
  }
}
