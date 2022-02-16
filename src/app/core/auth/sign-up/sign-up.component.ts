import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isLoading:boolean = false;
  email:string = '';
  password:string = '';

  constructor(private router : Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onHaveAccount() : void {
    this.router.navigate(['sign-in'])
  }

  stopLoading(): void {
    this.isLoading = false;
  }

  onSuccess(): void {
    this.stopLoading();
    this.router.navigate(['sign-in']);
  }

  onError(err: any): void {
    // console.error(err.message || JSON.stringify(err))
    this.router.navigate(['error']);
    this.isLoading = false;
  }

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.SignUp(this.email, this.password, this.onSuccess.bind(this), this.onError.bind(this));
    }
  }
}
