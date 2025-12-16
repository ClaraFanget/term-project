const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDdBAPCpYGesChLz_qLcTBg4RARKgWIY4U",
  authDomain: "bookstore-api-f554e.firebaseapp.com",
  projectId: "bookstore-api-f554e",
  storageBucket: "bookstore-api-f554e.firebasestorage.app",
  messagingSenderId: "821322807524",
  appId: "1:821322807524:web:27c617e59fd4a5a899d4f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    "autre@gmail.com",
    "password123"
  );

  const token = await userCredential.user.getIdToken();
  console.log("Firebase ID token :", token);
}

getToken().catch(console.error);
