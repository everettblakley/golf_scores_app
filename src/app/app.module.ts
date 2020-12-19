import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component';
import { UserService } from "./shared/user/user.service";


@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        NativeScriptUIDataFormModule,
        NativeScriptUIListViewModule,
        AppRoutingModule,
    ],
    declarations: [AppComponent, LoginComponent],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [UserService]
})
export class AppModule { }
