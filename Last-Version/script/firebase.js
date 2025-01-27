  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics,collection,addDock } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA73plPtQRl95GqhpQr8SIrlaNh5Wqe1pQ",
    authDomain: "test123-f3d10.firebaseapp.com",
    projectId: "test123-f3d10",
    storageBucket: "test123-f3d10.firebasestorage.app",
    messagingSenderId: "837432397673",
    appId: "1:837432397673:web:0f9d7ba597462459e937f8",
    measurementId: "G-C5N6WM759R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const db  = getFirestore(app)
  export const saveNew(title,)