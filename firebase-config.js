

// firebase-config.js (Compat CDN version) — no ES module imports needed

// 1) Make sure you load these scripts in index.html BEFORE this file:
// <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>
// (optional) <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>

// 2) Fill your Firebase project config here:
window.firebaseConfig = window.firebaseConfig || {

  apiKey: "AIzaSyBPr4X2_8JYCgXzMlTcVB0EJLhup9CdyYw",
  authDomain: "login-page-echo-file.firebaseapp.com",
  //databaseURL: "https://console.firebase.google.com/u/0/project/login-page-echo-file/database/login-page-echo-file-default-rtdb/data/~2F",
  projectId: "login-page-echo-file",
  storageBucket: "login-page-echo-file.firebasestorage.app",
  messagingSenderId: "200723524735",
  appId: "1:200723524735:web:9eaed6ef10cbc2c406234a"
};

// Initialize
if (!firebase.apps.length) {
  firebase.initializeApp(window.firebaseConfig);
}

// Firestore (compat)
const db = firebase.firestore();
window.db = db;

// Minimal wrappers to mimic v9 modular API but using compat under the hood:
window.fs = {
  // doc(db, "users", id)
  doc: (dbRef, coll, id) => dbRef.collection(coll).doc(id),
  // collection(db, "invites")
  collection: (dbRef, coll) => dbRef.collection(coll),
  // where("field","==","value")
  where: (field, op, value) => ({ __type: "where", field, op, value }),
  // query(collRef, where(...), where(...))
  query: (collRef, ...filters) => {
    let q = collRef;
    filters.forEach(f => {
      if (f && f.__type === "where") q = q.where(f.field, f.op, f.value);
    });
    return q;
  },
  // onSnapshot(queryRef, callback)
  onSnapshot: (qRef, cb) => qRef.onSnapshot(cb),
  // getDoc(docRef)
  getDoc: (docRef) => docRef.get(),
  // setDoc(docRef, data, {merge})
  setDoc: (docRef, data, opts) => {
    if (opts && opts.merge) return docRef.set(data, { merge: true });
    return docRef.set(data);
  },
  // updateDoc(docRef, data)
  updateDoc: (docRef, data) => docRef.update(data),
  // addDoc(collectionRef, data)
  addDoc: (collRef, data) => collRef.add(data),
};


// יוצר/מעודכן פרופיל משתמש ב-Firestore: users/{emailLowercase}
async function upsertUserProfile(email, extra = {}) {
  const key = (email || "").trim().toLowerCase();
  const ref = window.fs.doc(window.db, "users", key);
  await window.fs.setDoc(ref, { email: key, updatedAt: Date.now(), ...extra }, { merge: true });
}
// חושפים ל-main.js / שאר הקוד
window.upsertUserProfile = upsertUserProfile;



console.log("🔥 Firebase initialized:", firebase.apps.length > 0);
console.log("📊 Firestore available:", !!window.db);

setTimeout(async () => {
  try {
    const testRef = window.fs.collection(window.db, "users");
    console.log("✅ Firestore connection test passed");
  } catch (e) {
    console.error("❌ Firestore connection test failed:", e);
  }
}, 2000);