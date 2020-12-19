Golf Handicap Mobile App

The golf handicap app is a mobile app that allows users to track their golf handicap, using the World Golf Association Handicap System. The app is built using Angular and NativeScript, which is a framework which is written using Typescript and compiles to run natively on mobile devices. The backend portion of the application is done using Firebase, mostly for it's ease of use and low cost.

## Tech Stack

- [NativeScript](https://nativescript.org/)
- [Angular 8](angular.io)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firebase Cloud Firestore](https://firebase.google.com/products/firestore)
- [Firebase Cloud Functions](https://firebase.google.com/products/functions)

## Description

The user's handicap is computed using the World Golf Association Handicap System, and is computed using a Firebase Cloud Function that processes all scores you've submitted. This allows for a serverless app environment, easy to maintain code, and "hassle-free" backend development.

<video autoplay loop muted playsinline style="max-height:600px;">
  <source src="docs/showcase.webm" type="video/webm">
  <source src="docs/showcase.mp4" type="video/mp4">
</video>

NativeScript allows for the use of native components, like date pickers and switches, which provides a very native experience for the user.
