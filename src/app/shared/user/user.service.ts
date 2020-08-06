import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import * as firebase from "nativescript-plugin-firebase";

@Injectable()
export class UserService {

  constructor(ngZone: NgZone) {

  }

  public register(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.createUser({
        email: user.email,
        password: user.password,
      }).then(() => {
        firebase.updateProfile({
          displayName: user.name
        }).then((result: any) => {
          console.dir(result);
          resolve(JSON.stringify(result));
        })
          .catch((error) => reject(error))
      }, (error: any) =>
        reject(error))
    });
  }

  public login(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: user.email,
          password: user.password
        }
      }).then((result: any) => {
        console.dir(result);
        resolve(JSON.stringify(result));
      }, (error: any) => {
        reject(error);
      });
    });
  }
}