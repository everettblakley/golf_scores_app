import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

/**
 * Base resource type
 *
 * @export
 * @class Resource
 */
export class Resource {
    id: number;
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
 * Generic Rest Service for all rest services within the app
 *
 * @export
 * @class ResourceService
 * @template T
 */
export class ResourceService<T extends Resource> {
    constructor(
        // The Injected HttpClient
        private httpClient: HttpClient,

        // The base api url of the service
        private url: string,

        // The endpoint of the service
        private endpoint: string,

        // The serializer to convert to/from JSON objects
        private serializer: Serializer
    ) { }


    /**
     * Method to create a new object of type T
     *
     * @param {T} item
     * @returns {Observable<T>}
     * @memberof ResourceService
     */
    public create(item: T): Observable<T> {
        return this.httpClient
            .post<T>(
                `${this.url}/${this.endpoint}`,
                this.serializer.toJson(item)
            )
            .pipe(map((data) => this.serializer.fromJson(data) as T), catchError(this.handleErrors));
    }

    /**
     * Method to update an object of type {T}
     *
     * @param {T} item
     * @returns {Observable<T>}
     * @memberof ResourceService
     */
    public update(item: T): Observable<T> {
        return this.httpClient
            .put<T>(
                `${this.url}/${this.endpoint}/${item.id}`,
                this.serializer.toJson(item)
            )
            .pipe(map((data) => this.serializer.fromJson(data) as T), catchError(this.handleErrors));
    }

    /**
     * Returns an object of type {T} given its id
     *
     * @param {number} id
     * @returns {Observable<T>}
     * @memberof ResourceService
     */
    public read(id: number): Observable<T> {
        return this.httpClient
            .get(`${this.url}/${this.endpoint}/${id}`)
            .pipe(map((data: any) => this.serializer.fromJson(data) as T), catchError(this.handleErrors));
    }

    /**
     * Returns an observable array of objects of type {T} 
     *
     * @param {*} queryOptions Any filtering or querying options you wish to provide
     * @returns {Observable<T[]>}
     * @memberof ResourceService
     */
    public list(queryOptions: any): Observable<T[]> {
        return this.httpClient
            .get(
                `${this.url}/${this.endpoint}?${this.toQueryString(
                    queryOptions
                )}`
            )
            .pipe(map((data: any) => this.convertData(data.items)), catchError(this.handleErrors));
    }

    /**
     * Deleted an object of type {T} given the id
     *
     * @param {number} id
     * @returns
     * @memberof ResourceService
     */
    public delete(id: number) {
        return this.httpClient.delete(`${this.url}/${this.endpoint}/${id}`);
    }

    /**
     * Concerts the object from JSON to an array of the objects of type {T}
     *
     * @private
     * @param {*} data
     * @returns {T[]}
     * @memberof ResourceService
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
     * @memberof ResourceService
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
     * @memberof ResourceService
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
     * @memberof ResourceService
     */
    protected handleErrors(error: HttpErrorResponse) {
        console.log(error);
        return throwError(error);
    }
}
