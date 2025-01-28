import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA73plPtQRl95GqhpQr8SIrlaNh5Wqe1pQ",
  authDomain: "test123-f3d10.firebaseapp.com",
  projectId: "test123-f3d10",
  storageBucket: "test123-f3d10.appspot.com",
  messagingSenderId: "837432397673",
  appId: "1:837432397673:web:0f9d7ba597462459e937f8",
  measurementId: "G-C5N6WM759R"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para guardar la noticia en Firestore
export async function saveNewsToFirebase(newsData) {
  try {
    const docRef = await addDoc(collection(db, "news"), newsData);
    console.log("Noticia publicada con ID: ", docRef.id);
    alert("Notícia publicada amb èxit a Firebase!");
  } catch (error) {
    console.error("Error al publicar la notícia a Firebase: ", error);
    alert("Hi ha hagut un error publicant la notícia.");
  }
}
