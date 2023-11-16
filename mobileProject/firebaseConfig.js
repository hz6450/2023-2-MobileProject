import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
} from "react-native-dotenv";

// // 이해준
// const firebaseConfig = {
//   apiKey: "AIzaSyDVdIf3cw-ApoOeM1vFSWmztwuAU1JZ3X0",
//   authDomain: "mp-42119.firebaseapp.com",
//   projectId: "mp-42119",
//   storageBucket: "mp-42119.appspot.com",
//   messagingSenderId: "364334395555",
//   appId: "1:364334395555:web:ed5c8ae17e46fbb80b4f16"
// };

// //장호열
// const firebaseConfig = {
//   apiKey: "AIzaSyDDLd9BqDenAFef-OuF2zBS2JNVerR1G-M",
//   authDomain: "calendarrecipe.firebaseapp.com",
//   projectId: "calendarrecipe",
//   storageBucket: "calendarrecipe.appspot.com",
//   messagingSenderId: "600725474057",
//   appId: "1:600725474057:web:339ef0d9d179265d9721d8",
//   measurementId: "G-JL9NRBNN82"
// };

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, doc, getDoc, setDoc };