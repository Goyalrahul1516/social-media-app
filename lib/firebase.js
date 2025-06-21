import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpJEPhmgkWdBYP-ManCuBrFPAfnxR0QeY",
  authDomain: "future-university-project.firebaseapp.com",
  projectId: "future-university-project",
  storageBucket: "future-university-project.firebasestorage.app",
  messagingSenderId: "449117944501",
  appId: "1:449117944501:web:eedd1f62c8a08c60a6dcfc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);