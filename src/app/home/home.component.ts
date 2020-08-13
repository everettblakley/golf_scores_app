import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { environment } from "~/environments/environment.dev";
import { Score } from "../shared/score/score";
import { ScoreService } from "../shared/score/score.service";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { formatDate } from "../shared/utils/utils";
import { Page, NavigatedData } from "tns-core-modules/ui/page";
import { Subscription } from "rxjs";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { RadListView, ListViewEventData } from "nativescript-ui-listview";


@Component({
    selector: "Home",
    providers: [ScoreService],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    public scores: Score[] = [];
    public isLoading: boolean = false;
    public user: User;
    public sortOptions = ["Date (ascending)", "Date (descending)", "Highest first", "Lowest first"];
    public scoreSubscription: Subscription;

    constructor(private scoreSerivce: ScoreService, private router: RouterExtensions, private userService: UserService, private activateRoute: ActivatedRoute, private page: Page) {
        this.user = new User("", "", "Loading...", "");
    }

    get noScores() { return this.scores.length === 0; }

    goToProfile() {
        this.router.navigate(["profile"], {
            relativeTo: this.activateRoute,
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    goToScore(score?: Score) {
        const id = score ? score.id : null;
        this.router.navigate(["score", `${id ? id : "new"}`], {
            relativeTo: this.activateRoute,
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        })
    }

    onLongPress(score: Score) {
        const deleteScore = "Delete Score";
        const editScore = "Edit Score";
        dialogs.action({
            message: "What do you want to do?",
            cancelButtonText: "Cancel",
            actions: [deleteScore, editScore]
        }).then((result: any) => {
            if (result == deleteScore) {
                dialogs.confirm({
                    title: "Confirm delete",
                    message: "Are you sure you want to delete this score?",
                    okButtonText: "Delete",
                    cancelButtonText: "Cancel"
                }).then(() => this.scoreSerivce.delete(score.id)
                    .then(() => this.loadScores(),
                        (error) => dialogs.alert({
                            title: "An error occurred",
                            message: "Something went wrong and your score could not be deleted",
                            okButtonText: "Ok"
                        }).then(() => console.dir(error)))
                )
            } else {
                this.goToScore(score);
            }
        })
    }

    ngOnInit(): void {
        this.userService.currentUser()
            .then((user: User) => this.user = user)
            .catch((error) => {
                dialogs.alert({
                    title: "Unable to retrieve user information",
                    message: "Please login again",
                    okButtonText: "Ok"
                });
                console.log(error);
                this.router.navigate(['/login']);
            })
        this.page.on('navigatedTo', (data: NavigatedData) => {
            if (data.isBackNavigation) {
                console.log("reloading scores");
                this.loadScores();
                // Not sure why I need to explicitly call this, but I do?
                this.isLoading = false;
            }
        });

        this.loadScores();
    }

    formatDate = (date: string, format: string) => formatDate(date, format);

    loadScores() {
        this.isLoading = true;
        this.scoreSerivce.list().subscribe(
            (loadedScores) => {
                this.scores = loadedScores;
                this.isLoading = false;

                console.log("scores loaded");
            },
            (error) => {
                dialogs.alert({
                    title: "An error occurred",
                    message: "We were unable to retrieve your scores. Please try again later",
                    okButtonText: "Ok"
                });
                this.isLoading = false;
                console.log(error);
            });
    }
}
