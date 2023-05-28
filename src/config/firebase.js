import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOPpadQOIUWNbRblMKtp56OObqd1-E5hU",
  authDomain: "bracelet-store.firebaseapp.com",
  projectId: "bracelet-store",
  storageBucket: "bracelet-store.appspot.com",
  messagingSenderId: "422747552970",
  appId: "1:422747552970:web:1a60e79e1848e463440833"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };