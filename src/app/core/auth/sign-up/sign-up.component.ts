import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {NgForm} from "@angular/forms";
import {CognitoUserPool} from 'amazon-cognito-identity-js';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isLoading:boolean = false;
  email:string = '';
  password:string = '';

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  onHaveAccount() : void {
    this.router.navigate(['sign-in'])
  }

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      var poolData = {
        UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.cognitoAppClientId // Your client id here
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList: any[] = [];

      userPool.signUp(this.email, this.password, attributeList, [], (
        err,
        _
      ) => {
        this.isLoading = false;
        if (err) {
          alert(err.message || JSON.stringify(err));
          // this.router.navigate([errorToRoute(Errors.ServerError)])
          return;
        }
        // this.router.navigate(['/signin']);
      });
    }
  }
}
