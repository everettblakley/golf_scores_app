import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from "rxjs";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { Score } from "../shared/score/score";
import { ScoreService } from "../shared/score/score.service";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { formatDate } from "../shared/utils/utils";
import { HandicapService } from "../shared/handicap/handicap.service";


@Component({
    selector: "Home",
    providers: [ScoreService],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
    public scores: Score[] = [];
    public isLoading: boolean = false;
    public user: User;
    public sortOptions = ["Date (ascending)", "Date (descending)", "Highest first", "Lowest first"];
    private scoreSubscription: Subscription;
    private handicapSubscription: Subscription;

    public handicap: number;

    constructor(private scoreSerivce: ScoreService,
        private router: RouterExtensions,
        private userService: UserService,
        private handicapService: HandicapService,
        private activateRoute: ActivatedRoute,
        private page: Page,
        private changeDetectorRef: ChangeDetectorRef) {
        this.user = new User("", "", "Loading...", "");
        this.router.router.onSameUrlNavigation = "reload";
    }

    ngOnDestroy(): void {
        if (this.scoreSubscription) {
            this.scoreSubscription.unsubscribe();
        }
        if (this.handicapSubscription) {
            this.handicapSubscription.unsubscribe();
        }
    }

    get noScores() { return this.scores.length === 0; }

    get currentHandicap() {
        return `Current Handicap: ${
            this.handicap === undefined
                ? this.isLoading
                    ? "loading..."
                    : "unknown" :
                this.handicap === null
                    ? "N/A"
                    : this.handicap
            }`
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
                }).then(() => this.scoreSerivce.delete(score.id)
                    .then(() => this.init(),
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
                return;
            })
        this.page.on('navigatedTo', (data: NavigatedData) => {
            if (data.isBackNavigation) {
                this.init();
            }
        });

        this.init();
    }

    formatDate = (date: string, format: string) => formatDate(date, format);

    init() {
        this.isLoading = true;
        this.loadHandicap();
        this.loadScores();
    }

    loadHandicap() {
        this.handicapSubscription = this.handicapService.getHandicap().subscribe(
            (handicap) => {
                if (handicap !== undefined) {
                    this.handicap = handicap;
                }
                this.changeDetectorRef.detectChanges();
                if (this.isLoading) {
                    this.isLoading = false;
                }
                return;
            },
            (error) => {
                dialogs.alert({
                    title: "An error occurred",
                    message: "We were unable to retrieve your handicap. Please try again later",
                    okButtonText: "Ok"
                });
                console.log(error);
                return;
            }
        )
    }

    loadScores() {
        this.scoreSubscription = this.scoreSerivce.list().subscribe(
            (loadedScores) => {
                this.scores = loadedScores;
                this.changeDetectorRef.detectChanges();
                return;
            },
            (error) => {
                dialogs.alert({
                    title: "An error occurred",
                    message: "We were unable to retrieve your scores. Please try again later",
                    okButtonText: "Ok"
                });
                console.log(error);
                return;
            });
    }
}
