// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import firebase from "../../config";
const database=firebase.database();
const ref_tableProfils=database.ref("Tabledeprofils");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTu7fFWbsJmp3rSu_6ZOb24PWzDloVwnU",
  authDomain: "whatsappclone-25b77.firebaseapp.com",
  databaseURL: "https://whatsappclone-25b77-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-25b77",
  storageBucket: "whatsappclone-25b77.appspot.com",
  messagingSenderId: "192540568447",
  appId: "1:192540568447:web:e32beffc43abb57455084a",
  measurementId: "G-YYFP2R295T"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
