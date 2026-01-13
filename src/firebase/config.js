// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDGA_RjoVW-kp9DDIZqb31jvHPirsgGA4",
  authDomain: "smart-rent-predictor.firebaseapp.com",
  projectId: "smart-rent-predictor",
  storageBucket: "smart-rent-predictor.firebasestorage.app",
  messagingSenderId: "189556447738",
  appId: "1:189556447738:web:ee7033036d67f8feaf6c43"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize firebase Authentication and Firestore
export const auth=getAuth(app)
export const db=getFirestore(app)

export default app