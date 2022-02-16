import {Component, OnInit} from '@angular/core';
import {UserService} from "../../api/user.service";
import {User} from "../../shared/models/users/user";
import {getSrcSetFromImage} from "../../shared/models/images/image";
import {AuthService} from "../../core/auth/auth.service";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {
  public user: User | undefined;
  public isUserAuthorized: boolean | undefined;
  public userAvatarSrcSet: string[] = [];
  public jdenticonValue: string | undefined;

  constructor(private userService: UserService, private authService: AuthService) {
    userService.user.subscribe(next => {
      if (userService.isLoading) {
        return;
      }

      this.user = next;
      if (next != undefined) {
        this.jdenticonValue = `user-${next!.id}`
        this.userAvatarSrcSet = [];
        if (next.avatar != undefined) {
          this.userAvatarSrcSet.push(...getSrcSetFromImage(next.avatar));
        }
      }

      this.isUserAuthorized = next != undefined;
    });
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.isUserAuthorized = false;
    this.authService.logout();
  }

}
