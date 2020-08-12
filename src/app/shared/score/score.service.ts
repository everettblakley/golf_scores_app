import { Injectable } from "@angular/core";
import { FirebaseService } from "../genericFirebaseService";
import { Score, ScoreSerializer } from "./score";
import { Observable } from "rxjs";
import * as firebase from "nativescript-plugin-firebase/app";
import { firestore } from "nativescript-plugin-firebase";
import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/internal/operators/catchError";


@Injectable({
    providedIn: "root",
})
export class ScoreService extends FirebaseService<Score> {
    constructor() {
        super(
            "scores",
            new ScoreSerializer(),
        )
    }

    public listScores(): Observable<Score[]> {
        return Observable.create(subscriber => {
            const collectionRef = firebase.firestore().collection(this.collection)
                .orderBy("scoreDate", "desc").limit(20);
            collectionRef.onSnapshot((snapshot: firestore.QuerySnapshot) => {
                let collection = [];
                snapshot.forEach((document: firestore.DocumentSnapshot) => {
                    collection.push({ id: document.id, ...document.data() })
                });
                subscriber.next(collection);
            })
        }
        ).pipe(
            map((data: any) => this.convertData(data)),
            catchError(this.handleErrors)
        );
    }
}
