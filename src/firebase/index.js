import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBvrP59IhGiILIMo4RrgWS2-sFCR2HwSMw",
  authDomain: "ehealth-data-1a83f.firebaseapp.com",
  projectId: "ehealth-data-1a83f",
  storageBucket: "ehealth-data-1a83f.appspot.com",
  messagingSenderId: "341491542573",
  appId: "1:341491542573:web:3c7ccc59996ac9d716e6a4",
});

export const db = firebase.firestore();
export const people = db.collection("people");
