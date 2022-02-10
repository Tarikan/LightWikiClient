import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public showSidenav = false;
  title = 'LightWikiWebClient';

  public toggleSidenav(): void {
    console.log(this);
    this.showSidenav = !this.showSidenav;
  }
}
