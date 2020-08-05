import { Injectable } from "@angular/core";
import { User, UserSerializer } from "./user";
import { ResourceService } from "../genericHttpService";
import { HttpClient } from "@angular/common/http";
import { environment } from "~/environments/environment.dev";
import { Cognito } from "nativescript-cognito"

@Injectable({
  providedIn: "root"
})
export class UserService extends ResourceService<User> {
  // private cognito: Cognito;

  constructor(httpClient: HttpClient) {
    super(
      httpClient,
      environment.apiUrl,
      "user",
      new UserSerializer()
    );
    // this.cognito = new Cognito(environment.userPoolId, environment.clientId);
  }

  public login(user: User) {
    // return new Promise((resolve, reject) => {
    //   this.cognito.authenticate(user.email, user.password)
    //     .then(token => {
    //       console.log(token);
    //       resolve();
    //     })
    //     .catch(error => {
    //       this.handleErrors(error);
    //       reject();
    //     })
    // });
  }

  public signUp(user: User) {
    // return new Promise((resolve, reject) => {
    //   this.cognito.signUp(user.email, user.password, { name: user.name })
    //     .then(token => {
    //       console.log(token);
    //       // TODO: handle confirm account
    //       resolve();
    //     })
    //     .catch(error => {
    //       this.handleErrors(error);
    //       reject();
    //     })
    // })
  }
}