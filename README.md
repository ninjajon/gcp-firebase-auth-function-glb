# Authorized HTTPS Endpoint

This samples shows how to restrict an HTTPS Function to only the Firebase users of your app.

Only users who pass a valid Firebase ID token as a Bearer token in the `Authorization` header of the HTTP request are authorized to use the function.

Checking the ID token is done with an ExpressJs middleware that also passes the decoded ID token in the Express request object.

Once authorized the function respond with `Hello <username>`.

This sample comes with a simple web-based UI whose code is in [public](public) directory that lets you sign-in Firebase and initiates an authorized XHR to the Function.


## Setting up the sample

 1. Create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
 1. Make sure to adjust Cloud Functions Org Policies:
    - Allowed ingress settings (Cloud Functions)). [Until we find a way to deploy a function with Firebase CLI to avoid this and only allow private & LB traffic in].
    - Domain restricted sharing. To allow allUsers access.
 1. Enable the **Google** Provider in the **Auth** section.
 1. You must have the Firebase CLI installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
 1. Install dependencies locally by running: `cd functions; npm install; cd -`


## Deploy and test

This sample comes with a web-based UI for testing the function.
To test locally do:

 1. Start serving your project locally using `firebase serve --only hosting,functions`
 1. Open the app in a browser at `http://localhost:5000`.
 1. Sign in the web app in the browser using Google Sign-In and two authenticated requests will be performed from the client and the result will be displayed on the page, normally "Hello <user displayname>".


To deploy and test on prod do:

 1. Deploy your project using `firebase deploy`
 1. Open the app using `firebase open hosting:site`, this will open a browser.
 1. Sign in the web app in the browser using Google Sign-In and two authenticated requests will be performed from the client and the result will be displayed on the page, normally "Hello <user displayname>".


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](../CONTRIBUTING.md).


## License

© Google, 2017. Licensed under an [Apache-2](../LICENSE) license.
