import firebase from "firebase/compat/app";
// auth
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBekPKDQvnDaciDtYbQa4iWFNUV7VI83O4",
  authDomain: "clone-761f8.firebaseapp.com",
  projectId: "clone-761f8",
  storageBucket: "clone-761f8.firebasestorage.app",
  messagingSenderId: "538761510639",
  appId: "1:538761510639:web:8f1368678af5b53eabe51a",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = app.firestore();
