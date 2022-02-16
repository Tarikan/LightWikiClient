import { Component } from '@angular/core';
import {UserService} from "./api/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'LightWikiWebClient';
}
