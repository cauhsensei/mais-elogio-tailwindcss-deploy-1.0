import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FacebookAuthProvider } from "firebase/auth";
import {getAuth} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyASNEa1xipboB3iyEvr6a4gTUvsiDm6404",
  authDomain: "mais--elogio.firebaseapp.com",
  projectId: "mais--elogio",
  storageBucket: "mais--elogio.appspot.com",
  messagingSenderId: "903008737461",
  appId: "1:903008737461:web:a18a64405f1157d97546fc"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);
const auth = getAuth(app);

const provider = new FacebookAuthProvider();

export { ref, uploadBytes, getDownloadURL };
export {auth, provider}
export { db };
export { app };