import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {NgForm} from "@angular/forms";
import { CognitoUserPool,CognitoUserAttribute } from 'amazon-cognito-identity-js';
import {Router} from "@angular/router";

interface formDataInterface {
  "email": string,
  "password": string
};

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
      let formData: formDataInterface = {
        "email": this.email,
        "password": this.password,
      }

      userPool.signUp(this.email, this.password, attributeList, [], (
        err,
        result
      ) => {
        this.isLoading = false;
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        // this.router.navigate(['/signin']);
      });
    }
  }
}
