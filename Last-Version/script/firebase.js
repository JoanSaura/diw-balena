  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import {
    getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc
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

  export const getUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  export const getUserByEmail = async (email) => {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  };

  export const createUser = async (userData) => {
    const userRef = doc(db, "users", userData.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, userData);
      console.log("Usuari creat correctament.");
    } else {
      console.log("L'usuari ja existeix.");
    }
  };

  export const editUser = async (email, newUserData) => {
    const userRef = doc(db, "users", email);
    
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log("Usuari no trobat.");
      return;
    }

    const currentUserData = userSnap.data();
    const updatedUserData = {
      ...currentUserData, 
      ...newUserData,    
    };

    await setDoc(userRef, updatedUserData, { merge: true });
    console.log("Usuari editat correctament.");
  };

  export const deleteUser = async (email) => {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("Usuari no trobat.");
      return;
    }

    await deleteDoc(userRef);
    console.log("Usuari eliminat correctament.");
  };

  export const changePassword = async (email, newPassword, newSalt) => {
    const userRef = doc(db, "users", email);

    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.log("Usuari no trobat.");
      return;
    }

    const encryptedPassword = encryptPassword(newPassword, newSalt); 

    await setDoc(userRef, {
      password: encryptedPassword,
      salt: newSalt,
      is_first_login: false,  
    }, { merge: true });

    console.log("Contrasenya canviada correctament.");
  };

  export const getNews = async () => {
    const newsCollection = collection(db, "news");
    const newsSnapshot = await getDocs(newsCollection);

    const filteredNews = newsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(news => news.status === true); 

    console.log("Notícies publicades:", filteredNews);

    return filteredNews;
};


  export const publishNews = async (id, title, content, author, creationDate) => {
    const newsData = {
      id,
      title,
      content,
      author,
      creationDate,
      status: true
    };
  
    await setDoc(doc(db, "news", id.toString()), newsData);
    console.log("Notícia publicada correctament:", newsData);
    return newsData;
  };

  export const saveDraft = async (id, title, content, author, creationDate) => {
    const newsData = {
      id,
      title,
      content,
      author,
      creationDate,
      status: false
    };

    await setDoc(doc(db, "news", id.toString()), newsData);
    console.log("Esborrany guardat correctament:", newsData);
    return newsData;
};

export const getDrafts = async () => {
  const draftsCollection = collection(db, "news");
  const draftsSnapshot = await getDocs(draftsCollection);

  const drafts = draftsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(draft => draft.status === false);  

  console.log("Esborranys carregats:", drafts);
  return drafts;
};



  export const deleteNews = async (newsId) => {
    if (!newsId) {
        console.error("Error: ID de notícia invàlid:", newsId);
        return;
    }

    if (confirm("Estàs segur que vols eliminar aquesta notícia?")) {
        try {
            await deleteDoc(doc(db, "news", String(newsId)));  
            alert("Notícia eliminada correctament. per favor recarrega la pagina");
            location.reload(); 
        } catch (error) {
            console.error("Error eliminant la notícia:", error);
            alert("Error en eliminar la notícia. Torna-ho a intentar.");
        }
    }
};

