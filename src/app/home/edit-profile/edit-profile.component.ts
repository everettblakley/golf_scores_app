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
            case undefined: {
              this.router.backToPreviousPage();
            }
            case false: {
              return;
            }
            case true: {
              this.performSave()
                .then(() => this.router.backToPreviousPage());
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
    message: "Your score was successfully saved",
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
              this.savePossible = false;
              resolve()
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

  notImplemented() {
    dialogs.alert({
      title: "No implemented",
      message: "This will do something eventually",
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
