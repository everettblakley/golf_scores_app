import { Resource, Serializer } from "../genericHttpService";

var validator = require("email-validator");

export class User extends Resource {
  public name: string;
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(email: string, password: string, name?: string, confirmPassword?: string) {
    super();
    this.email = email;
    this.name = name;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  public isEmailValid(): boolean {
    return validator.validate(this.email);
  }
}


export class UserSerializer implements Serializer {
  fromJson(json: any): User {
    const user = new User("", "");
    user.id = json.id;
    user.name = json.name;
    user.email = json.email;
    user.password = ""
    return user;
  }
  toJson(resource: User) {
    return {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      password: resource.password
    };
  }

}