import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadDataForm } from 'nativescript-ui-dataform';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Page } from 'tns-core-modules/ui/page';
import { Score } from '~/app/shared/score/score';
import { ScoreService } from '~/app/shared/score/score.service';

@Component({
  selector: 'ns-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css', "../home.component.css"]
})
export class ScoreComponent implements OnInit {
  public title: string;
  public score: Score;
  public isLoading: boolean = false;
  public savePossible: boolean = false;

  @ViewChild("scoreForm", null) form: ElementRef;

  constructor(private page: Page, private router: RouterExtensions, private activeRoute: ActivatedRoute, public scoreService: ScoreService) { }

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
              // Discard changes
              this.router.backToPreviousPage();
            }
            case false: {
              // Cancel
              return;
            }
            case true: {
              // Save changes
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
      if (this.score.id === undefined) {
        this.scoreService.create(this.score)
          .toPromise()
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
      } else {
        this.scoreService.update(this.score)
          .toPromise()
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
          })
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const params = this.activeRoute.snapshot.params;
    if (params.id == undefined) {
      this.title = "New Score";
      this.score = new Score();
      this.savePossible = true;
      this.isLoading = false;
    } else {
      this.title = "Score detail";
      this.scoreService.read(params.id)
        .subscribe((score: Score) => {
          this.score = score;
          this.isLoading = false;
        },
          (error) => console.log(error));
    }
  }

  public scoreMetadata = {
    "isReadOnly": false,
    "commitMode": "Immediate",
    "validationMode": "Immediate",
    "propertyAnnotations": [
      {
        "name": "course",
        "displayName": "Course",
        "index": 0,
        "required": true,
        "validators": [
          {
            "name": "NonEmpty",
            "params": {
              "errorMessage": "Please enter a course name"
            }
          }
        ],
        "groupName": "Required Information"
      },
      {
        "name": "grossScore",
        "displayName": "Gross Score",
        "index": 1,
        "required": true,
        "editor": "Number",
        "validators": [
          {
            "name": "Range",
            "params": {
              "minimum": 0,
              "maximum": 1000,
              "errorMessage": "Please enter a valid gross score"
            }
          }
        ],
        "groupName": "Required Information"
      },
      {
        "name": "scoreDate",
        "displayName": "Score Date",
        "index": 2,
        "editor": "DatePicker",
        "required": true,
        "validators": [
          {
            "name": "NonEmpty",
            "params": {
              "errorMessage": "Please enter a date"
            }
          }
        ],
        "groupName": "Required Information"
      },
      {
        "name": "slope",
        "displayName": "Slope",
        "index": 3,
        "editor": "Number",
        "required": true,
        "validators": [
          {
            "name": "Range",
            "params": {
              "minimum": 55,
              "maximum": 155,
              "errorMessage": "Please enter a value between 55 and 155"
            }
          }
        ],
        "groupName": "Required Information"
      },
      {
        "name": "rating",
        "displayName": "Rating",
        "index": 4,
        "editor": "Decimal",
        "required": true,
        "validators": [
          {
            "name": "Range",
            "params": {
              "minimum": 0.0,
              "errorMessage": "Please enter a value greater than 0"
            }
          }
        ],
        "groupName": "Required Information"
      },
      {
        "name": "holes",
        "displayName": "Holes",
        "index": 5,
        "editor": "SegmentedEditor",
        "valuesProvider": [18, 9],
        "required": true,
        "groupName": "Required Information"
      },
      {
        "name": "conditions",
        "displayName": "Conditions",
        "index": 6,
        "required": false,
        "editor": "List",
        "valuesProvider": ["Sunny", "Rainy", "Windy",],
        "groupName": "Optional Information"
      },
      {
        "name": "tees",
        "displayName": "Tees",
        "index": 7,
        "required": false,
        "editor": "SegmentedEditor",
        "valuesProvider": ["Blue", "Red", "White"],
        "groupName": "Optional Information"
      },
      {
        "name": "notes",
        "displayName": "Notes",
        "index": 8,
        "required": false,
        "editor": "MultilineText",
        "groupName": "Optional Information",
        "validators": [
          {
            "name": "MaximumLength",
            "params": {
              "length": 255,
              "errorMessage": "Please enter less than 255 characters"
            }
          }
        ]
      },
      {
        "name": "createdAt",
        "ignore": true
      },
      {
        "name": "id",
        "ignore": true
      },
      {
        "name": "ownerId",
        "ignore": true
      }

    ]
  }

}
