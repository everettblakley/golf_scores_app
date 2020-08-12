import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from '~/app/shared/user/user.service';
import { User } from '~/app/shared/user/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', "../home.component.css"]
})
export class ProfileComponent implements OnInit {
  public user: User;
  public isLoading: boolean = false;

  constructor(private router: RouterExtensions, private userService: UserService, private activatedRoute: ActivatedRoute) { }

  goBack() {
    this.router.backToPreviousPage();
  }

  public logout() {
    this.userService.logout()
      .then(() => this.router.navigate(["/login"], { clearHistory: true }));
  }

  editProfile = () => this.router.navigate(["edit"], {
    relativeTo: this.activatedRoute,
    animated: true,
    transition: {
      name: "slide",
      duration: 200,
      curve: "ease"
    }
  });

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.currentUser()
      .then((user: User) => {
        this.user = user;
        this.isLoading = false;
      });
  }

}
