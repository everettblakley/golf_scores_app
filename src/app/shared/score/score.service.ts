import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "~/environments/environment.dev";
import { ResourceService } from "../genericHttpService";
import { Score, ScoreSerializer } from "./score";

@Injectable({
    providedIn: "root",
})
export class ScoreService extends ResourceService<Score> {
    private scores = new Array<Score>({
        id: 1,
        course: "Land O Lakes",
        grossScore: 88,
        createdAt: "",
        scoreDate: "",
        slope: 124,
        rating: 69.9,
        conditions: "Sunny",
        tees: "blue",
        holes: 18,
    });

    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.apiUrl,
            "scores",
            new ScoreSerializer()
        )
    }
}
