import { getDatabase, ref, set, once } from "firebase/database";
import { initializeApp } from "firebase/app";
import ShortUniqueId from 'short-unique-id';
import express from 'express';

const firebaseConfig = {
 apiKey: "AIzaSyDsqhCTlhHCBBPGVWHC8V2VdI0Gr26YupY",
 authDomain: "unityapp-e903b.firebaseapp.com",
 databaseURL: "https://unityapp-e903b-default-rtdb.firebaseio.com",
 projectId: "unityapp-e903b",
 storageBucket: "unityapp-e903b.appspot.com",
 messagingSenderId: "572778167218",
 appId: "1:572778167218:web:1e96a54b61ee550501c2ab"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const uid = new ShortUniqueId({ length: 6 });
const port = 3000;

const app = express();

app.get('/generateToken', (req, res) => {
    let token = uid.randomUUID();
    const tokenRef = ref(db, 'tokens/' + token);
    once(tokenRef, 'value').then((snapshot) => {
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
