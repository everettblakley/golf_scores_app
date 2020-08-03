import { Component, OnInit } from "@angular/core";
import { Score } from "../shared/score/score";
import { ScoreService } from "../shared/score/score.service";
import { environment } from "~/environments/environment.dev";

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

    constructor(private scoreSerivce: ScoreService) {
        // Use the component constructor to inject providers.
        this.production = environment.production ? "production" : "dev";
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.scoreSerivce.getScores().subscribe((loadedScores) => {
            loadedScores.forEach((scoreObject) => {
                this.scores.unshift(scoreObject);
            });
            this.isLoading = false;
            console.dir(this.scores);
        });
    }
}
