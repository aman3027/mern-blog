import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCfIU4zavOylYVUdBkfriLSQSthAaV9q1o",
  authDomain: "react-js-blog-aman.firebaseapp.com",
  projectId: "react-js-blog-aman",
  storageBucket: "react-js-blog-aman.appspot.com",
  messagingSenderId: "360997180694",
  appId: "1:360997180694:web:d9c874b9b49fd63b7c2c37",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};

export default firebaseConfig;