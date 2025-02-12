import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Configuración de Firebase
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

  if (!userSnap.exists()) {
    await setDoc(userRef, userData);
    console.log("Usuario creado en Firestore");
  } else {
    console.log("El usuario ya existe");
  }
};

// Editar usuario por correo
export const editUser = async (email, newUserData) => {
  const userRef = doc(db, "users", email);
  
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log("Usuario no encontrado");
    return;
  }

  const currentUserData = userSnap.data();
  const updatedUserData = {
    ...currentUserData, 
    ...newUserData,    
  };

  await setDoc(userRef, updatedUserData, { merge: true });
  console.log("Usuario editado correctamente en Firestore");
};

// Eliminar usuario
export const deleteUser = async (email) => {
  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.log("Usuario no encontrado");
    return;
  }

  await deleteDoc(userRef);
  console.log("Usuario eliminado correctamente de Firestore");
};

// Cambiar la contraseña de un usuario
export const changePassword = async (email, newPassword, newSalt) => {
  const userRef = doc(db, "users", email);

  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    console.log("Usuario no encontrado");
    return;
  }

  const encryptedPassword = encryptPassword(newPassword, newSalt); // Suponiendo que tienes una función encryptPassword

  await setDoc(userRef, {
    password: encryptedPassword,
    salt: newSalt,
    is_first_login: false,  // Cambia el estado a false después del primer login
  }, { merge: true });

  console.log("Contraseña actualizada y is_first_login actualizado en Firestore");
};
