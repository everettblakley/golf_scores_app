import { Component, OnInit } from "@angular/core";
import { environment } from "~/environments/environment.dev";

const firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        firebase.init({
            persist: false,
            // storageBucket: environment.firebasePhotoBucket
        }).then(
            () => console.log("firebase.init done"),
            (error: any) => console.log(`firebase.init error: ${error}`)
        );
    }
}
