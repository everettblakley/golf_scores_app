import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firestore } from "nativescript-plugin-firebase";
import * as firebaseApp from "nativescript-plugin-firebase/app";
import { from, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError, map, switchMap } from "rxjs/operators";
import { User } from "./user/user";
import { UserService } from "./user/user.service";

/**
 * Base resource type
 *
 * @export
 * @class Resource
 */
export class Resource {
    id: string;
    ownerId: string;
}

/**
 * Interface for object serializers to convert to/from JSON objects
 *
 * @export
 * @interface Serializer
 */
export interface Serializer {
    fromJson(json: any): Resource;
    toJson(resource: Resource): any;
}

/**
 * Generic Firebase Service for all rest services within the app
 *
 * @export
 * @class FirebaseService
 * @template T
 */
@Injectable()
export class FirebaseService<T extends Resource> {
    constructor(
        // The name of the collection in Firebase
        protected collection: string,

        // The serializer to convert to/from JSON objects
        private serializer: Serializer,
        private userService: UserService,
    ) { }

    private currentUserId(): Observable<string> {
        return from(
            this.userService.currentUser()
                .then((user: User) => {
                    console.log(user);
                    return user.id
                })
        );
    }


    /**
     * Method to create a new object of type T
     *
     * @param {T} item
     * @returns {Observable<T>}
     * @memberof FirebaseService
     */
    public create(item: T): Observable<any> {
        return this.currentUserId()
            .pipe(
                switchMap((id: string) => {
                    console.log(id);
                    item.ownerId = id;
                    return from(
                        firebaseApp.firestore()
                            .collection(this.collection)
                            .add(this.serializer.toJson(item))
                    )
                }),
                map((data) => this.serializer.fromJson(data) as T),
                catchError(this.handleErrors)
            );
    }

    /**
     * Method to update an object of type {T}
     *
     * @param {T} item
     * @returns {Observable<void>}
     * @memberof FirebaseService
     */
    public update(item: T): Observable<void> {
        return from(
            firebaseApp.firestore()
                .collection(this.collection)
                .doc(item.id)
                .update(this.serializer.toJson(item))
        ).pipe(
            catchError(this.handleErrors)
        );
    }

    /**
     * Returns an object of type {T} given its id
     *
     * @param {number} id
     * @returns {Observable<T>}
     * @memberof FirebaseService
     */
    public read(id: string): Observable<T> {
        return from(
            firebaseApp.firestore()
                .collection(this.collection)
                .doc(id)
                .get({ source: "server" })
                .then((doc) => ({ id: doc.id, ...doc.data() }))
        ).pipe(
            map((data: any) => this.serializer.fromJson(data) as T),
            catchError(this.handleErrors)
        );
    }

    /**
     * Returns an observable array of objects of type {T} 
     *
     * @param {*} queryOptions Any filtering or querying options you wish to provide
     * @returns {Observable<T[]>}
     * @memberof FirebaseService
     */
    public list(): Observable<T[]> {
        // return Observable.create(subscriber => {
        //     const collectionRef = firebaseApp.firestore().collection(this.collection);
        //     collectionRef.onSnapshot((snapshot: firestore.QuerySnapshot) => {
        //         console.dir(snapshot);
        //         let collection = [];
        //         snapshot.forEach((document: firestore.DocumentSnapshot) => {
        //             collection.push({ id: document.id, ...document.data() })
        //         });
        //         subscriber.next(collection);
        //     })
        // }).pipe(
        //     map((data: any) => this.convertData(data)),
        //     catchError(this.handleErrors)
        // );
        return from(
            firebaseApp.firestore()
                .collection(this.collection)
                .get({ source: "server" })
                .then((querySnapshot: firestore.QuerySnapshot) => {
                    let docs = [];
                    querySnapshot.forEach((doc: firestore.DocumentSnapshot) => {
                        // console.log(doc.data());
                        docs.push({ id: doc.id, ...doc.data() })
                    })
                    return docs;
                })
        ).pipe(
            map((data: any) => this.convertData(data)),
            catchError(this.handleErrors)
        )
    }

    /**
     * Deleted an object of type {T} given the id
     *
     * @param {number} id
     * @returns {Promise<void>}
     * @memberof FirebaseService
     */
    public delete(id: string): Promise<void> {
        return firebaseApp.firestore()
            .collection(this.collection)
            .doc(id)
            .delete()
    }

    /**
     * Concerts the object from JSON to an array of the objects of type {T}
     *
     * @private
     * @param {*} data
     * @returns {T[]}
     * @memberof FirebaseService
     */
    protected convertData(data: any): T[] {
        return data.map((item: any) => this.serializer.fromJson(item));
    }

    /**
     * Internal method to encode the query string parameters to a JSON object
     *
     * @private
     * @param {*} paramsObject
     * @returns {string}
     * @memberof FirebaseService
     */
    protected toQueryString(paramsObject: any): string {
        return Object.keys(paramsObject)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        paramsObject[key]
                    )}`
            )
            .join("&");
    }

    /**
     * Internal method to specify which request headers should be include on the HTTP request
     *
     * @protected
     * @returns
     * @memberof FirebaseService
     */
    protected getCommonHeaders() {
        return new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Kinvey ", //+ Config.token,
        });
    }

    /**
     * Used to log or display any errors encountered by the service
     *
     * @private
     * @param {HttpErrorResponse} error
     * @returns
     * @memberof FirebaseService
     */
    protected handleErrors(error: HttpErrorResponse) {
        console.log(error);
        return throwError(error);
    }
}
