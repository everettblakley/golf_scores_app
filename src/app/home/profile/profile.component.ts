import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from '~/app/shared/user/user.service';

@Component({
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: RouterExtensions, private userService: UserService) { }

  goBack() {
    this.router.backToPreviousPage();
  }

  public logout() {
    this.userService.logout()
      .then(() => this.router.navigate(["/login"], { clearHistory: true }));
  }

  ngOnInit(): void {
  }

}
