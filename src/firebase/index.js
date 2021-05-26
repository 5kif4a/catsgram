import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
 // insert firebase config here
};

export const fbApp = firebase.initializeApp(firebaseConfig);

export const db = fbApp.database()

export const storage = fbApp.storage()