import { Injectable } from "@angular/core";
import { FirebaseService } from "../genericHttpService";
import { Score, ScoreSerializer } from "./score";
import * as moment from "moment";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})
export class ScoreService extends FirebaseService<Score> {
    private scores = new Array<Score>({
        id: "test_id",
        course: "Land O Lakes",
        grossScore: 88,
        createdAt: moment(),
        scoreDate: moment(),
        slope: 124,
        rating: 69.9,
        conditions: "Sunny",
        tees: "blue",
        holes: 18,
    });

    constructor() {
        super(
            "scores",
            new ScoreSerializer()
        )
    }
}
