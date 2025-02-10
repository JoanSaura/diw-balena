import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc
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

// Obtener todos los usuarios de Firestore
export const getUsers = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener un usuario por correo
export const getUserByEmail = async (email) => {
  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Crear un usuario si no existe
export const createUser = async (userData) => {
  const userRef = doc(db, "users", userData.email);
  const userSnap = await getDoc(userRef);

  // Si el usuario no existe, crear el usuario
  if (!userSnap.exists()) {
    await setDoc(userRef, userData);
    console.log("Usuari creat en Firestore");
  } else {
    console.log("L'usuari ja existeix");
  }
};

// Editar usuario por correo (actualiza solo los campos que han cambiado)
export const editUser = async (email, newUserData) => {
  const userRef = doc(db, "users", email);
  
  // Obtener los datos actuales del usuario
  const userSnap = await getDoc(userRef);
  
  // Si el usuario no existe, salir
  if (!userSnap.exists()) {
    console.log("Usuari no trobat!");
    return;
  }

  // Obtener los datos del usuario actual
  const currentUserData = userSnap.data();

  // Crear un objeto con los datos actuales y los nuevos datos
  const updatedUserData = {
    ...currentUserData, // Conservar los datos actuales
    ...newUserData,     // Sobrescribir con los nuevos datos proporcionados
  };

  // Actualizar solo los campos modificados sin eliminar otros
  await setDoc(userRef, updatedUserData, { merge: true });
  console.log("Usuari editat correctament en Firestore, només els canvis!");
};
