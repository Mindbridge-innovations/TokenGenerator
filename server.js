const { getDatabase, ref, set, get } = require("firebase/database");
const { initializeApp } = require("firebase/app");
const ShortUniqueId = require('short-unique-id');
const express = require('express');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const uid = new ShortUniqueId({ length: 6 });
const port = 3000;

const app = express();

app.get('/generateToken', (req, res) => {
    let token = uid.randomUUID();
    const tokenRef = ref(db, 'tokens/' + token);

    // Use get instead of once
    get(tokenRef).then((snapshot) => {
        if (!snapshot.exists()) {
            set(tokenRef, {
                token: token
            }).then(() => {
                res.send({ token: token });
            });
        } else {
            res.status(409).send({ error: 'Token already exists' });
        }
    });
});

app.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});
