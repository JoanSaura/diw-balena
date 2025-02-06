// firebaseConfig.js
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { 
    getFirestore, collection, addDoc, getDocs, onSnapshot, doc, deleteDoc, updateDoc 
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

//News
export const publishNews = async (newsData) => {
    await addDoc(collection(db, "news"), newsData);
};

export const getNews = async () => {
    const querySnapshot = await getDocs(collection(db, "news"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const editNews = async (id, updatedData) => {
    await updateDoc(doc(db, "news", id), updatedData);
};

export const deleteNews = async (id) => {
    await deleteDoc(doc(db, "news", id));
};
