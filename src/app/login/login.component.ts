import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page, View } from 'tns-core-modules/ui/page';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user';
import { RadDataForm } from 'nativescript-ui-dataform';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoggingIn: boolean = true;
  public user: User;

  constructor(private page: Page, private userService: UserService) {
    page.actionBarHidden = true;
    page.backgroundImage = "~/app/images/golf_course.jpg";
  }

  toggleForm() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  submit() {
    console.dir(this.user);
  }

  public isFormValid(): boolean {
    let valid = false;

    return valid;
  }

  ngOnInit() {
    this.user = new User("", "", "", "");
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
    "propertyAnnotations":
      [
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
          "required": true,
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
    "propertyAnnotations":
      [
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
          "required": true,
        }
      ]
  }


}
