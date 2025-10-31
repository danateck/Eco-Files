// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, collection, addDoc, getDoc, getDocs, doc, query, where, updateDoc, setDoc  , arrayUnion} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPr4X2_8JYCgXzMlTcVB0EJLhup9CdyYw",
  authDomain: "login-page-echo-file.firebaseapp.com",
  projectId: "login-page-echo-file",
  storageBucket: "login-page-echo-file.firebasestorage.app",
  messagingSenderId: "200723524735",
  appId: "1:200723524735:web:9eaed6ef10cbc2c406234a"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,  // ✅ FORCE long-polling (not auto-detect)
  experimentalAutoDetectLongPolling: false, // ❌ disable auto-detect
  useFetchStreams: false                    // ❌ disable fetch streams to ensure long polling
});
// Make everything available globally for main.js
window.db = db;
window.fs = {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
  arrayUnion
};

console.log("✅ Firestore connected with long polling");


// // Initialize Firebase
// try {
//   if (!firebase.apps.length) {
//     firebase.initializeApp(window.firebaseConfig);
//     console.log("✅ Firebase initialized successfully");
//   }
  
//   // Firestore
//   const db = firebase.firestore();
//   window.db = db;
  
//   // בדיקת חיבור
//   db.collection("_test").limit(1).get()
//     .then(() => console.log("✅ Firestore connected"))
//     .catch(err => console.warn("⚠️ Firestore connection issue:", err.message));
    
// } catch (error) {
//   console.error("❌ Firebase initialization failed:", error);
//   window.db = null; // סימון שאין חיבור
// }

// // ===== פונקציות עזר ל-Firestore (compat API) =====
// window.fs = {
//   doc: (db, coll, id) => db?.collection(coll).doc(id),
//   collection: (db, coll) => db?.collection(coll),
//   getDoc: (docRef) => docRef?.get(),
//   setDoc: (docRef, data, opts) => {
//     if (opts?.merge) return docRef?.set(data, { merge: true });
//     return docRef?.set(data);
//   },
//   updateDoc: (docRef, data) => docRef?.update(data),
//   addDoc: (collRef, data) => collRef?.add(data),
//   getDocs: (queryRef) => queryRef?.get(),
//   where: (field, op, value) => ({ __type: "where", field, op, value }),
//   query: (collRef, ...filters) => {
//     let q = collRef;
//     filters.forEach(f => {
//       if (f?.__type === "where") q = q.where(f.field, f.op, f.value);
//     });
//     return q;
//   }
// };

// // פונקציה ליצירת/עדכון פרופיל משתמש
// async function upsertUserProfile(email, extra = {}) {
//   if (!window.db) {
//     console.warn("Firestore לא זמין, משתמש רק ב-localStorage");
//     return;
//   }
  
//   try {
//     const key = (email || "").trim().toLowerCase();
//     const ref = window.fs.doc(window.db, "users", key);
//     await window.fs.setDoc(ref, { 
//       email: key, 
//       updatedAt: Date.now(), 
//       ...extra 
//     }, { merge: true });
//     console.log("✅ פרופיל נשמר ב-Firestore:", key);
//   } catch (err) {
//     console.warn("⚠️ לא הצלחתי לשמור פרופיל:", err.message);
//   }
// }

// window.upsertUserProfile = upsertUserProfile;



