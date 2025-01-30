// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5dfnT533xpK-qa2-0PYiTzBawfMIKSdE",
  authDomain: "elecsys-6020f.firebaseapp.com",
  projectId: "elecsys-6020f",
  storageBucket: "elecsys-6020f.firebasestorage.app",
  messagingSenderId: "957531703999",
  appId: "1:957531703999:web:bbb53a5e3548bde623d40a",
  measurementId: "G-5WGV7EHN5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);