import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase settings
const firebaseConfig = {
  apiKey: "AIzaSyDIM_yWvciInCwzGDtmLhfMjWkJGh-Tqrc",
  authDomain: "waitlist-e52d0.firebaseapp.com",
  databaseURL: "https://waitlist-e52d0-default-rtdb.firebaseio.com",
  projectId: "waitlist-e52d0",
  storageBucket: "waitlist-e52d0.appspot.com",
  messagingSenderId: "304324298526",
  appId: "1:304324298526:web:6ac4828e828eca45a36b0f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

export { db };
