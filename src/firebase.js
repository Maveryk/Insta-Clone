import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({

    apiKey: "AIzaSyDs7kvNfJu4mfOnQ1uoqIhKx7sGT7emw_g",
    authDomain: "instagram-clone-48700.firebaseapp.com",
    projectId: "instagram-clone-48700",
    storageBucket: "instagram-clone-48700.appspot.com",
    messagingSenderId: "793463552987",
    appId: "1:793463552987:web:6b4c213d63e9f484b1c5fe",
    measurementId: "G-4L4E65HWTG"
    
  });

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const functions  = firebase.functions();

  export {db, auth, storage, functions};