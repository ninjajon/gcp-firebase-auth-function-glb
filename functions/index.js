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

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const cookieParser = require('cookie-parser')();
//const cors = require('cors');//({origin: true});
const cors = require('cors')({
  origin: true,
});
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
  functions.logger.log('Check if request is authorized with Firebase ID token');
  functions.logger.log('authorization header:', req.headers.authorization)

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
    res.status(403).send('Unauthorized-1');
    return;
  }

  let idToken;
  functions.logger.log(req.headers);
  if (req.headers.firebasetoken && req.headers.firebasetoken.startsWith('Bearer ')) {
    functions.logger.log('Found "FirebaseToken" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.firebasetoken.split(' ')[1];
  } else {
    // No cookie
    res.status(403).send('Unauthorized-2');
    return;
  }

  try {
    functions.logger.log('just before decoding');
    functions.logger.log('idToken - New = ', idToken);
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized-3');
    return;
  }
};

app.use(cors);
app.use(validateFirebaseIdToken);
app.get('*/hello', (req, res) => {
  // @ts-ignore
  // res.set('Access-Control-Allow-Origin', '*');

  // if (req.method === 'OPTIONS') {
  //   // Send response to OPTIONS requests
  //   res.set('Access-Control-Allow-Methods', 'GET');
  //   res.set('Access-Control-Allow-Headers', 'Content-Type', 'authorization', 'firebasetoken');
  //   res.set('Access-Control-Max-Age', '3600');
  //   res.status(204).send('');
  // } else {
  cors(req, res, () => {
    res.send(`Hello ${req.user.name}`);
  })
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
