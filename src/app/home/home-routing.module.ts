import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";
import { ProfileComponent } from "./profile/profile.component";
import { ScoreComponent } from "./score/score.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "profile", component: ProfileComponent, pathMatch: "full" },
    { path: "profile/edit", component: EditProfileComponent, pathMatch: "full" },
    { path: "score/new", component: ScoreComponent },
    { path: "score/:id", component: ScoreComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
