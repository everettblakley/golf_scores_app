import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { Page } from 'tns-core-modules/ui/page';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { User } from '../shared/user/user';
import { UserService } from '../shared/user/user.service';

import * as loginForm from "./loginForm.json";
import * as signupForm from "./signUpForm.json";

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoggingIn: boolean = true;
  public user: User;
  public isLoading: boolean = false;

  constructor(private page: Page, private userService: UserService, private router: RouterExtensions) {
    page.actionBarHidden = true;
    page.backgroundImage = "~/app/images/golf_course.jpg";
  }

  ngOnInit() {
    if (ApplicationSettings.getBoolean("authenticated", false)) {
      this.router.navigate(["/home"], { clearHistory: true });
    };
    this.user = new User("e@b.com", "Password1!", "", "");
  }

  toggleForm() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  submit() {
    this.isLoading = true;

    if (this.isLoggingIn) {
      this.userService.login(this.user)
        .then((result: any) => {

          this.isLoading = false;

          ApplicationSettings.setBoolean("authenticated", true);
          console.dir(result);
          this.router.navigate(["/home"], { clearHistory: true });
        })
        .catch((error) => {
          this.isLoading = false;
          dialogs.alert({
            title: "An error occurred",
            message: `${error}`,
            okButtonText: "Close"
          })
        }
        );
    } else {
      this.userService.register(this.user)
        .then(() => {
          this.isLoading = false;
          dialogs.alert({
            title: "Sign-up successful!",
            message: "Please login with your newly created account",
            okButtonText: "Ok"
          }).then(() => this.isLoggingIn = true);
        })
        .catch((error) => {
          this.isLoading = false;
          dialogs.alert({
            title: "An error occurred",
            message: `${error}`,
            okButtonText: "Close"
          });
        }
        );
    }
  }

  public isFormValid(): boolean {
    let valid = false;

    return valid;
  }

  dfPropertyValidate(args: any) {
    let validationResult = true;

    if (args.propertyName === "confirmPassword") {
      const dataForm = args.object;
      const password1 = dataForm.getPropertyByName("password");
      const password2 = args.entityProperty;
      if (password1.valueCandidate !== password2.valueCandidate) {
        password2.errorMessage = "Passwords do not match.";
        validationResult = false;
      }
    }

    args.returnValue = validationResult;
  }

  loginFormMetadata = {
    "isReadOnly": false,
    "commitMode": "Immediate",
    "validationMode": "Immediate",
    "propertyAnnotations": [
      {
        "name": "name",
        "displayName": "Name",
        "index": 0,
        "required": false,
        "ignore": true
      },
      {
        "name": "email",
        "displayName": "Email",
        "index": 1,
        "editor": "Email",
        "required": true,
        "validators": [
          {
            "name": "Email",
            "params": {
              "errorMessage": "Invalid email address"
            }
          }
        ]
      },
      {
        "name": "password",
        "displayName": "Password",
        "index": 2,
        "editor": "Password",
        "required": true
      },
      {
        "name": "confirmPassword",
        "displayName": "Confirm Password",
        "index": 3,
        "editor": "Password",
        "ignore": true,
        "required": false
      }
    ]
  }

  signupFormMetadata = {
    "isReadOnly": false,
    "commitMode": "Immediate",
    "validationMode": "Immediate",
    "propertyAnnotations": [
      {
        "name": "name",
        "displayName": "Name",
        "index": 0,
        "required": true
      },
      {
        "name": "email",
        "displayName": "Email",
        "index": 1,
        "editor": "Email",
        "required": true,
        "validators": [
          {
            "name": "Email",
            "params": {
              "errorMessage": "Invalid email address"
            }
          }
        ]
      },
      {
        "name": "password",
        "displayName": "Password",
        "index": 2,
        "editor": "Password",
        "required": true,
        "validators": [
          {
            "name": "RegEx",
            "params": {
              "regEx": "^(?=.{10,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$",
              "errorMessage": "Password must have at least 8 characters, at least one lowercase letter, at least one uppercase letter, and at least one number"
            }
          }
        ]
      },
      {
        "name": "confirmPassword",
        "displayName": "Confirm Password",
        "index": 3,
        "editor": "Password",
        "required": true
      }
    ]
  }


}
