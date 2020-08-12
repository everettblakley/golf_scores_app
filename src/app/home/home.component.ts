import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { environment } from "~/environments/environment.dev";
import { Score } from "../shared/score/score";
import { ScoreService } from "../shared/score/score.service";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { formatDate } from "../shared/utils/utils";


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
    public production: string = "";
    public sortOptions = ["Date (ascending)", "Date (descending)", "Highest first", "Lowest first"];

    constructor(private scoreSerivce: ScoreService, private router: RouterExtensions, private userService: UserService, private activateRoute: ActivatedRoute) {
        this.production = environment.production ? "production" : "dev";
        this.user = new User("", "", "Loading...", "");
    }

    get noScores() { return this.scores.length === 0; }

    dosomething() {
        alert("To be implemented: Navigate to profile");
    }

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
                }).then(() => console.log("Deleting score " + score.id))
            } else {
                this.goToScore(score);
            }
        })
    }

    toString = (item: any) => (JSON.stringify(item));

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
        this.loadScores();
    }

    formatDate = (date: string, format: string) => formatDate(date, format);

    loadScores() {
        this.isLoading = true;
        this.scoreSerivce.list().subscribe(
            (loadedScores) => {
                this.scores = loadedScores;
                this.isLoading = false;
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
