import { Injectable } from "@angular/core";
import { FirebaseService } from "../genericFirebaseService";
import { UserService } from "../user/user.service";
import { Score, ScoreSerializer } from "./score";


@Injectable({
    providedIn: "root",
})
export class ScoreService extends FirebaseService<Score> {
    constructor(userService: UserService) {
        super(
            "scores",
            new ScoreSerializer(),
            userService
        )
    }
}
