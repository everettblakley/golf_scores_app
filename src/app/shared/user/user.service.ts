import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import * as firebase from "nativescript-plugin-firebase";
import * as ApplicationSettings from "tns-core-modules/application-settings";

@Injectable()
export class UserService {

  constructor(ngZone: NgZone) {

  }

  public register(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      firebase.createUser({
        email: user.email,
        password: user.password,
      }).then((registerResult: firebase.User) => {
        firebase.updateProfile({
          displayName: user.name
        }).then(() => {
          resolve(user);
        })
          .catch((error) => reject(error))
      }, (error: any) =>
        reject(error))
    });
  }

  public login(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      firebase.login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: user.email,
          password: user.password
        }
      }).then((result: firebase.User) => {
        const userResult = new User(result.email, user.password, result.displayName);
        resolve(userResult);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public currentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      firebase.getCurrentUser()
        .then((userResult: firebase.User) => {
          const name = userResult.displayName || "No name";
          const user = new User(userResult.email, "", name, "");
          resolve(user);
        })
        .catch(error => reject(error));
    })
  }


  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.logout()
        .then(() => {
          ApplicationSettings.remove("lastAuthenticated");
          resolve()
        })
        .catch((error: any) => reject(error))
    })
  }
}