import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, doc, getDoc, setDoc };