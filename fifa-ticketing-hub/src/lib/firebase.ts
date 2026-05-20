// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSxt5iujNMECYdpgLM4CRzUvoUu30fIb8",
  authDomain: "fifa-ticketing-hub.firebaseapp.com",
  projectId: "fifa-ticketing-hub",
  storageBucket: "fifa-ticketing-hub.firebasestorage.app",
  messagingSenderId: "1090682598996",
  appId: "1:1090682598996:web:dd021b9a985c730b7c5fc1",
  measurementId: "G-K22V4SHJW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
githubProvider.setCustomParameters({ prompt: "select_account" });