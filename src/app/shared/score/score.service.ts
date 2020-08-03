import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Score } from "./score";
import { environment } from "~/environments/environment.dev";

@Injectable({
    providedIn: "root",
})
export class ScoreService {
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

    private baseUrl = "";
    constructor(private http: HttpClient) {}

    getScores(): Observable<Score[]> {
        return this.http
            .get(environment.apiUrl, { headers: this.getCommonHeaders() })
            .pipe(
                map((data: any[]) => {
                    return this.scores;
                }),
                catchError(this.handleErrors)
            );
    }

    getScore(id: number): Observable<Score> {
        return this.http.get("", { headers: this.getCommonHeaders() }).pipe(
            map((data: any[]) => {
                return this.scores[0];
            }),
            catchError(this.handleErrors)
        );
    }

    private getCommonHeaders() {
        return new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Kinvey ", //+ Config.token,
        });
    }

    private handleErrors(error: HttpErrorResponse) {
        console.log(error);
        return throwError(error);
    }
}
