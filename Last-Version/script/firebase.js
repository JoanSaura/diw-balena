import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtY_Fs4GfJ-ZjiSXjG4i2NY-VVOVlJptg",
  authDomain: "db-balena.firebaseapp.com",
  projectId: "db-balena",
  storageBucket: "db-balena.firebasestorage.app",
  messagingSenderId: "414130343961",
  appId: "1:414130343961:web:bc8e7956ab286df01bda88"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Crea el DEFAULT_USER
export const createUser = async (userData) => {
  const userRef = doc(db, "users", userData.email); 
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, userData);
    console.log("Usuari creat en Firestore");
  } else {
    console.log("Ja exiteix el usuario per defecte");
  }
};

// Obtenir usuari per correu
export const getUserByEmail = async (email) => {
  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const editUser = async (email, userData) => {
  const userRef = doc(db, "users", email);
  await setDoc(userRef, userData);
  console.log("Usuari editat en Firestore");  
}
