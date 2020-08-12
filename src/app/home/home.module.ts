import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgShadowModule } from 'nativescript-ng-shadow';
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { ProfileComponent } from './profile/profile.component';
import { ScoreComponent } from './score/score.component';
import { ScoreService } from "../shared/score/score.service";
import { UserService } from "../shared/user/user.service";



@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule,
        NgShadowModule,
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
        ProfileComponent,
        ScoreComponent
    ],
    providers: [ScoreService, UserService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
