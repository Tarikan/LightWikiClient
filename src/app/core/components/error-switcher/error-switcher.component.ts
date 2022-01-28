import {Component, Input, OnInit} from '@angular/core';
import {Errors} from "../../enums/errors";

@Component({
  selector: 'app-error-switcher',
  templateUrl: './error-switcher.component.html',
  styleUrls: ['./error-switcher.component.css']
})
export class ErrorSwitcherComponent implements OnInit {

  @Input('error') errorCode! : Errors;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.errorCode)
  }

}
