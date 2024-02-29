import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4PoTuDo6elHriGgyU0A7Ac4LY7DtvNbA",
  authDomain: "tawimi-91e29.firebaseapp.com",
  projectId: "tawimi-91e29",
  storageBucket: "tawimi-91e29.appspot.com",
  messagingSenderId: "663600018966",
  appId: "1:663600018966:web:739f2a157094dea732e737",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
