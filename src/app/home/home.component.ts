import { Component, OnInit } from "@angular/core";
import { Score } from "../shared/score/score";
import { ScoreService } from "../shared/score/score.service";
import { environment } from "~/environments/environment.dev";
import { Observable } from "rxjs";
import { formatDate } from "../shared/utils/utils";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "Home",
    providers: [ScoreService],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    public scores: Score[] = [];
    public isLoading: boolean = false;
    public production: string = "";
    public sortOptions = ["Date (ascending)", "Date (descending)", "Highest first", "Lowest first"];

    constructor(private scoreSerivce: ScoreService, private router: RouterExtensions, private userService: UserService) {
        this.production = environment.production ? "production" : "dev";
    }

    dosomething() {
        alert("To be implemented: Navigate to profile");
    }

    async logout() {
        await this.userService.logout();
        this.router.navigate(["/login"]);
    }

    toString = (item: any) => (JSON.stringify(item));

    ngOnInit(): void {
        this.loadScores();
    }

    formatDate = (date: string, format: string) => formatDate(date, format);

    loadScores() {
        this.isLoading = true;
        this.scoreSerivce.list({}).subscribe((loadedScores) => {
            this.scores = loadedScores;
            this.isLoading = false;
        });
    }
}
