/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes the Demo.
function Demo() {
  document.addEventListener('DOMContentLoaded', function() {
    // Shortcuts to DOM Elements.
    this.signInButton = document.getElementById('demo-sign-in-button');
    this.signOutButton = document.getElementById('demo-sign-out-button');
    this.responseContainer = document.getElementById('demo-response');
    this.urlContainer = document.getElementById('demo-url');
    //this.helloUserUrl = window.location.href + 'hello'; 
    //this.helloUserUrl = 'https://us-central1-jo-firebase-auth-fct-glb-jxba.cloudfunctions.net/app/hello';
    this.helloUserUrl = 'https://fct3.ninjajon.com/app/hello';
    this.signedOutCard = document.getElementById('demo-signed-out-card');
    this.signedInCard = document.getElementById('demo-signed-in-card');

    // Bind events.
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }.bind(this));
}

// Triggered on Firebase auth state change.
Demo.prototype.onAuthStateChanged = function(user) {
  if (user) {
    this.urlContainer.textContent = this.helloUserUrl;    
    this.signedOutCard.style.display = 'none';
    this.signedInCard.style.display = 'block';
    this.startFunctionsRequest();
  } else {
    this.signedOutCard.style.display = 'block';
    this.signedInCard.style.display = 'none';
  }
};

// Initiates the sign-in flow using GoogleAuthProvider sign in in a popup.
Demo.prototype.signIn = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  //firebase.auth().signInWithPopup(new firebase.auth.OAuthProvider('oidc.slalomjo'));
};

// Signs-out of Firebase.
Demo.prototype.signOut = function() {
  firebase.auth().signOut();
};

// Does an authenticated request to a Firebase Functions endpoint using an Authorization header.
Demo.prototype.startFunctionsRequest = function() {
  firebase.auth()
  //.signInWithPopup(new firebase.auth.OAuthProvider('oidc.slalomjo'))
  .signInWithPopup(new firebase.auth.GoogleAuthProvider)
  .then((result) => {
    firebase.auth().currentUser.getIdToken().then(function(token) {
      var req = new XMLHttpRequest();
      req.onload = function() {
        this.responseContainer.innerText = req.responseText;
      }.bind(this);
      req.onerror = function() {
        this.responseContainer.innerText = 'There was an error';
      }.bind(this);
      req.open('GET', this.helloUserUrl, true);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.send();
    }.bind(this));
  })
}

// Load the demo.
window.demo = new Demo();
