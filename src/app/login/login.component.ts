import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { RouterExtensions } from 'nativescript-angular/router';
import { Couchbase } from "nativescript-couchbase-plugin";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { EventData, Page } from 'tns-core-modules/ui/page';
import { Switch } from "tns-core-modules/ui/switch";
import { environment } from '~/environments/environment.dev';
import { User } from '../shared/user/user';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoggingIn: boolean = true;
  public user: User;
  public isLoading: boolean = false;
  public db: Couchbase;

  private lastAuthenticated = "lastAuthenticated"
  private rememberMeKey = "rememberMe"

  constructor(private page: Page, private userService: UserService, private router: RouterExtensions) {
    page.actionBarHidden = true;
    page.backgroundImage = "~/app/images/golf_course.jpg";
  }

  ngOnInit() {
    this.isLoading = true;
    this.db = new Couchbase(environment.dbName);
    const userResult = this.getLocalUser();
    if (userResult != null && ApplicationSettings.hasKey(this.rememberMeKey) && ApplicationSettings.getBoolean(this.rememberMeKey)) {
      // If there is a user in the local db, set the user to it and log them in
      this.user = new User(userResult.email, userResult.password || "", userResult.name, "");

      if (ApplicationSettings.hasKey(this.lastAuthenticated)) {
        const lastAuthenticated = moment(ApplicationSettings.getString(this.lastAuthenticated)).toISOString();
        if (moment(lastAuthenticated).isBefore(moment().subtract(moment.duration(1, "hours")))) {
          this.performLogin();
        } else {
          this.router.navigate(["/home"], { clearHistory: true });
        }
      }

      this.isLoading = false;
      return;
    } else {
      ApplicationSettings.setBoolean(this.rememberMeKey, false);
      this.user = new User("", "", "", "");
      this.isLoading = false;
      return;
    }
  }

  get rememberMe() {
    return ApplicationSettings.getBoolean(this.rememberMeKey);
  }

  getLocalUser() {
    return this.db.getDocument(environment.dbUserKey);
  }

  toggleForm() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  onCheckedChange(args: EventData) {
    this.isLoading = true;
    let sw = args.object as Switch;
    if (!ApplicationSettings.hasKey(this.rememberMeKey)) {
      ApplicationSettings.setBoolean(this.rememberMeKey, false);
    } else {
      if (sw.checked !== undefined) {
        ApplicationSettings.setBoolean(this.rememberMeKey, sw.checked);
      } else {
        ApplicationSettings.setBoolean(this.rememberMeKey, false);
      }
    }
    this.isLoading = false;
  }

  performLogin() {
    this.userService.login(this.user)
      .then((result: User) => {

        this.isLoading = false;

        ApplicationSettings.setString(this.lastAuthenticated, moment().toISOString());

        const user = this.getLocalUser();
        if (this.rememberMe) {
          if (user != null) {
            this.db.updateDocument(environment.dbUserKey, result);
          } else {
            this.db.createDocument(result, environment.dbUserKey);
          }
        } else {
          this.db.deleteDocument(environment.dbUserKey);
        }

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
  }

  submit() {
    this.isLoading = true;

    if (this.isLoggingIn) {
      this.performLogin();
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
