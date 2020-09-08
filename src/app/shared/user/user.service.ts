import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import * as firebase from "nativescript-plugin-firebase";
import * as ApplicationSettings from "tns-core-modules/application-settings";

@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(ngZone: NgZone) {

  }

  public uploadPhoto(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.currentUser()
        .then((user: User) => {
          firebase.storage.uploadFile({
            remoteFullPath: "userPhotos/" + user.id + ".jpg",
            localFile: path,
            onProgress: function (status) {
              console.log("Upload facetion: " + status.fractionCompleted)
            }
          }).then(
            (uploadedFile) => resolve(uploadedFile),
            (error) => reject(error)
          )
        })
        .catch((error) => reject(error))
    });
  }

  public update(user: User, photoUrl?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.updateProfile({
        displayName: user.name,
        photoURL: photoUrl
      }).then(
        () => resolve(),
        () => reject()
      );
    })
  }

  public register(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      firebase.createUser({
        email: user.email,
        password: user.password,
      }).then((registerResult: firebase.User) => {
        firebase.updateProfile({
          displayName: user.name
        }).then(
          () => resolve(user),
          (error) => reject(error))
      },
        (error: any) => reject(error)
      )
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
        userResult.id = result.uid;
        userResult.ownerId = result.uid;
        resolve(userResult);
      }, (error: any) => reject(error));
    });
  }

  public currentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      firebase.getCurrentUser()
        .then((userResult: firebase.User) => {
          const name = userResult.displayName || "No name";
          const user = new User(userResult.email, "", name, "");
          user.id = userResult.uid;
          user.ownerId = userResult.uid;
          resolve(user);
        },
          error => reject(error)
        );
    })
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.logout()
        .then(() => {
          ApplicationSettings.remove("lastAuthenticated");
          resolve()
        },
          (error: any) => reject(error)
        )
    })
  }

  public sendChangePasswordEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(email);

      firebase.sendPasswordResetEmail(email)
        .then(() => {
          console.log("Success");
          resolve();
        })
        .catch((error: any) => reject(error));
    })
  }
}