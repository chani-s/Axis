// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdinkLJseW16Pe5SQoKmzBmm7SLJj-xhs",
  authDomain: "test-faf4b.firebaseapp.com",
  projectId: "test-faf4b",
  storageBucket: "test-faf4b.firebasestorage.app",
  messagingSenderId: "230201202708",
  appId: "1:230201202708:web:deb07042faca3031ad6f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const gprovider = new GoogleAuthProvider();
export const db = getFirestore(app);