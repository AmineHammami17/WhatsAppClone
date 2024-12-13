import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTu7fFWbsJmp3rSu_6ZOb24PWzDloVwnU",
  authDomain: "whatsappclone-25b77.firebaseapp.com",
  databaseURL: "https://whatsappclone-25b77-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-25b77",
  storageBucket: "whatsappclone-25b77.appspot.com",
  messagingSenderId: "192540568447",
  appId: "1:192540568447:web:e32beffc43abb57455084a",
  measurementId: "G-YYFP2R295T",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://bjsbmidloldqbquovjqg.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc2JtaWRsb2xkcWJxdW92anFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzIzNzAsImV4cCI6MjA0ODU0ODM3MH0.-mX91eBk79SVNkfhYz8GvaRKu1xKKZdrxC289kK_Ttw"
const supabase = createClient(supabaseUrl, supabaseKey)

export {supabase};