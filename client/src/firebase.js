// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-9d62f.firebaseapp.com",
  projectId: "mern-blog-9d62f",
  storageBucket: "mern-blog-9d62f.appspot.com",
  messagingSenderId: "881669058433",
  appId: "1:881669058433:web:4816dcc9eaa16008e78280"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);