import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

var firebaseConfig = {
  // apiKey: ,
  // authDomain: ,
  // projectId: ,
  // storageBucket: ,
  // messagingSenderId: ,
  // appId: ,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { firebase as default, db };
