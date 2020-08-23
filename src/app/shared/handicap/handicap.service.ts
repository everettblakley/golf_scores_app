import * as firebase from "nativescript-plugin-firebase";
import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";


@Injectable()
export class HandicapService {
  constructor() { }

  private handicapFunction = firebase.functions.httpsCallable("getHandicap");

  public getHandicap(): Observable<any> {
    return from(
      this.handicapFunction(null)
    ).pipe(
      map((data: any) => {
        return data.handicap as number
      }),
      catchError((error) => {
        console.log(error)
        return throwError(error);
      })
    )
  }
}