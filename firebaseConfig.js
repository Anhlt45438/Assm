// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2QYhQOQrsWRgZ6AwjIbdoULccov3gj_8",
  authDomain: "md-18402.firebaseapp.com",
  projectId: "md-18402",
  storageBucket: "md-18402.appspot.com",
  messagingSenderId: "839012625162",
  appId: "1:839012625162:web:b94a8643c721523424e8f3",
  measurementId: "G-5LC7Q0T6DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

isSupported().then((supported) => {
    if (supported) {
        const analytics = getAnalytics(app);
    } else {
        console.log("Firebase Analytics is not supported in this environment.");
    }
});


export default app;