import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { RadDataForm } from 'nativescript-ui-dataform';
import { User } from '~/app/shared/user/user';
import { UserService } from '~/app/shared/user/user.service';

@Component({
  selector: 'ns-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css', "../home.component.css"]
})
export class EditProfileComponent implements OnInit {
  public user: User;
  public savePossible: boolean = false;
  public isLoading: boolean = false;

  @ViewChild("form", null) form: ElementRef;

  constructor(private router: RouterExtensions, private userService: UserService) { }

  goBack() {
    if (this.savePossible) {
      dialogs.confirm({
        title: "Save changes?",
        message: "Do you want to save your changes before exiting?",
        okButtonText: "Save",
        neutralButtonText: "Discard",
        cancelButtonText: "Cancel"
      })
        .then((option) => {
          switch (option) {
            // Discard
            case undefined: {
              this.router.backToPreviousPage();
            }
            // Cancel
            case false: {
              return;
            }
            // Save
            case true: {
              this.performSave();
            }
          }
        })
    } else {
      this.router.backToPreviousPage();
    }
  }

  public setChangesMade = () => this.savePossible = true;

  public notifySaveSuccessful = () => dialogs.alert({
    title: "Save Successful!",
    message: "Your account has been updated. Please login in again to see the changes",
    okButtonText: "Ok"
  });

  public notifySaveUnsuccessful = () => dialogs.alert({
    title: "An error occurred",
    message: "Something went wrong. Please try again later",
    okButtonText: "Ok"
  });

  async performSave(): Promise<any> {
    const form = this.form.nativeElement as RadDataForm;
    const formIsValid = await form.validateAll();
    if (!formIsValid) {
      return dialogs.alert({
        title: "Your score contains errors",
        message: "Please correct errors before saving",
        okButtonText: "Ok"
      });
    }

    return new Promise((resolve, reject) => {
      this.userService.update(this.user)
        .then(() => {
          this.notifySaveSuccessful()
            .then(() => {
              this.userService.logout()
                .then(() => this.router.navigate(["/login"], { clearHistory: true }));
            });
        })
        .catch((error) => {
          console.dir(error);
          this.notifySaveUnsuccessful()
            .then(() => {
              this.savePossible = false;
              reject(error)
            });
        });
    });
  }

  changePassword() {
    dialogs.confirm({
      title: "Change password",
      message: `Instructions will be sent to ${this.user.email}. Proceed?`,
      cancelButtonText: "Cancel",
      okButtonText: "Ok"
    })
      .then((option) => {
        if (!option) return;
        this.userService.sendChangePasswordEmail(this.user.email)
          .then(() => dialogs.alert({
            title: "Success!",
            message: `Change password instructions sent to ${this.user.email}. Please login with your new password`,
            okButtonText: "Ok"
          }).then(() =>
            this.userService.logout()
              .then(() => this.router.navigate(["/login"], { clearHistory: true }))
          ))
          .catch((error: any) => {
            console.log(error);
            this.notifySaveUnsuccessful();
          });
      })
  }

  notImplemented() {
    dialogs.alert({
      title: "No implemented",
      message: "This will do something, eventually",
      okButtonText: "Ok"
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.currentUser()
      .then((user: User) => {
        this.user = user;
        this.isLoading = false;
      })
  }

  userMetadata = {
    "isReadOnly": false,
    "commitMode": "Immediate",
    "validationMode": "Immediate",
    "propertyAnnotations": [
      {
        "name": "name",
        "displayName": "Name",
        "index": 0,
        "required": true,
        "validators": [
          {
            "name": "NonEmpty",
            "params": {
              "errorMessage": "Please enter a name"
            }
          }
        ]
      },
      {
        "name": "email",
        "ignore": true
      },
      {
        "name": "ownerId",
        "ignore": true
      },
      {
        "name": "password",
        "ignore": true
      },
      {
        "name": "confirmPassword",
        "ignore": true
      },
      {
        "name": "id",
        "ignore": true
      }
    ]

  }

}
