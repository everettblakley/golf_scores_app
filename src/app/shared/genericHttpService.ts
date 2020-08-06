import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import * as firebase from "nativescript-plugin-firebase/app";

/**
 * Base resource type
 *
 * @export
 * @class Resource
 */
export class Resource {
    id: string;
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
export class FirebaseService<T extends Resource> {
    constructor(
        // The name of the collection in Firebase
        private collection: string,

        // The serializer to convert to/from JSON objects
        private serializer: Serializer
    ) { }


    /**
     * Method to create a new object of type T
     *
     * @param {T} item
     * @returns {Observable<T>}
     * @memberof FirebaseService
     */
    public create(item: T): Observable<any> {
        return from(
            firebase.firestore()
                .collection(this.collection)
                .add(this.serializer.toJson(item))
        ).pipe(
            map((data) => this.serializer.fromJson(data) as T),
            catchError(this.handleErrors)
        );
    }

    /**
     * Method to update an object of type {T}
     *
     * @param {T} item
     * @returns {Observable<T>}
     * @memberof FirebaseService
     */
    public update(item: T): Observable<T> {
        return from(
            firebase.firestore()
                .collection(this.collection)
                .doc(item.id)
                .update(this.serializer.toJson(item))
        ).pipe(
            map((data) => this.serializer.fromJson(data) as T),
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
            firebase.firestore()
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
    public list(queryOptions: any): Observable<T[]> {
        return from(
            firebase.firestore()
                .collection(this.collection)
                .get(queryOptions)
                .then((snapshot) => {
                    let result = []
                    snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() }))
                    return result;
                })
        ).pipe(
            map((data: any) => this.convertData(data)),
            catchError(this.handleErrors)
        );
    }

    /**
     * Deleted an object of type {T} given the id
     *
     * @param {number} id
     * @returns
     * @memberof FirebaseService
     */
    public delete(id: string) {
        return firebase.firestore()
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
