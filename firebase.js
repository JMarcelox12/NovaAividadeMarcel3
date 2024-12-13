// Import the functions you need from the SDKs you need
//import * as firebase from "firebase
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// cada produto do firebase deve ser importad separadamente
//por exemplo auth de autenticação
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu32VG8AMLiG_z4AiSctMXXKxPLqY4G44",
  authDomain: "atividademarcel.firebaseapp.com",
  projectId: "atividademarcel",
  storageBucket: "atividademarcel.firebasestorage.app",
  messagingSenderId: "211966850861",
  appId: "1:211966850861:web:2df8bc7ad1929e713145a4",
  measurementId: "G-V6G0VMY315"
};


// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage()    
export { auth, firestore, storage };
