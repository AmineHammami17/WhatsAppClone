// Import the functions you need from the SDKs you need
import { app } from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/compact/auth';
import
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTu7fFWbsJmp3rSu_6ZOb24PWzDloVwnU",
  authDomain: "whatsappclone-25b77.firebaseapp.com",
  databaseURL: "https://whatsappclone-25b77-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-25b77",
  storageBucket: "whatsappclone-25b77.firebasestorage.app",
  messagingSenderId: "192540568447",
  appId: "1:192540568447:web:e32beffc43abb57455084a",
  measurementId: "G-YYFP2R295T"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;