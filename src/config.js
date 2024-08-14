import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCWK1GKZsUMejmwa9rMsbZ_GgWSDdJSw0",
  authDomain: "ladiversite-ec6ad.firebaseapp.com",
  databaseURL: "https://ladiversite-ec6ad-default-rtdb.firebaseio.com",
  projectId: "ladiversite-ec6ad",
  storageBucket: "ladiversite-ec6ad.appspot.com",
  messagingSenderId: "293315143618",
  appId: "1:293315143618:web:b0585b6e89c4e66c8e585b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, db, auth };
