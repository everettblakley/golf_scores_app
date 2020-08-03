import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";

export class Resource {
    id: number;
}

export interface Serializer {
    fromJson(json: any): Resource;
    toJson(resource: Resource): any;
}

// Generic Rest Service for all rest services within the app
export class ResourceService<T extends Resource> {
    constructor(
        private httpClient: HttpClient,
        private url: string,
        private endpoint: string,
        private serializer: Serializer
    ) {}

    public create(item: T): Observable<T> {
        return this.httpClient
            .post<T>(
                `${this.url}/${this.endpoint}`,
                this.serializer.toJson(item)
            )
            .pipe(map((data) => this.serializer.fromJson(data) as T));
    }

    public update(item: T): Observable<T> {
        return this.httpClient
            .put<T>(
                `${this.url}/${this.endpoint}/${item.id}`,
                this.serializer.toJson(item)
            )
            .pipe(map((data) => this.serializer.fromJson(data) as T));
    }

    read(id: number): Observable<T> {
        return this.httpClient
            .get(`${this.url}/${this.endpoint}/${id}`)
            .pipe(map((data: any) => this.serializer.fromJson(data) as T));
    }

    list(queryOptions: any): Observable<T[]> {
        return this.httpClient
            .get(
                `${this.url}/${this.endpoint}?${this.toQueryString(
                    queryOptions
                )}`
            )
            .pipe(map((data: any) => this.convertData(data.items)));
    }

    delete(id: number) {
        return this.httpClient.delete(`${this.url}/${this.endpoint}/${id}`);
    }

    private convertData(data: any): T[] {
        return data.map((item) => this.serializer.fromJson(item));
    }

    private toQueryString(paramsObject: any): string {
        return Object.keys(paramsObject)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        paramsObject[key]
                    )}`
            )
            .join("&");
    }
}
