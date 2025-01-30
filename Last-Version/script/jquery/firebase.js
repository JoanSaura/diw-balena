// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSdSAvvo7Nlgi_XhruGXjiwGtRYhPfADo",
  authDomain: "diw-balena-db.firebaseapp.com",
  projectId: "diw-balena-db",
  storageBucket: "diw-balena-db.firebasestorage.app",
  messagingSenderId: "690233376981",
  appId: "1:690233376981:web:699b2b5a908034cb56e25c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export const saveTask = () =>{
    
}
