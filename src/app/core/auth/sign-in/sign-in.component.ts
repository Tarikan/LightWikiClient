import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  email_address: string = "";
  password: string = "";

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onNeedAccount(): void {
    this.router.navigate(['sign-up'])
  }

  stopLoading(): void {
    this.isLoading = false;
  }

  onSuccess(): void {
    this.stopLoading();
    this.router.navigate(['workspaces']);
  }

  onError(err: any): void {
    // console.error(err.message || JSON.stringify(err))
    // this.router.navigate(['error']);
    this.isLoading = false;
  }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;

      this.authService.SignIn(
        this.email_address,
        this.password,
        this.onSuccess.bind(this),
        this.onError.bind(this));
    }
  }
}
