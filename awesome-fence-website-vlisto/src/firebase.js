// FIREBASE
import { initializeApp } from "firebase/app";

// FIRESTORE
import { getFirestore } from "firebase/firestore";

// STORAGE
import { getStorage } from "firebase/storage";

// AUTH
import { getAuth } from "firebase/auth";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAuGC8PzUq0_Fzvp8z0BCofWQlItZ8WYX4",

  authDomain: "awesome-fence-chat.firebaseapp.com",

  projectId: "awesome-fence-chat",

  storageBucket: "awesome-fence-chat.firebasestorage.app",

  messagingSenderId: "905256480812",

  appId: "1:905256480812:web:0987863f4d75c8bca1a189",
};

// INIT
const app = initializeApp(firebaseConfig);

// DATABASE
export const db = getFirestore(app);

// STORAGE
export const storage = getStorage(app);

// AUTH
export const auth = getAuth(app);

// EXPORT
export default app;