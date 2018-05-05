import * as firebase from 'firebase';
const config = {
  apiKey: "AIzaSyAxrvmpgLh2eYfprjKNzfnTnVcEzV4mwAs",
  authDomain: "firulais-app.firebaseapp.com",
  databaseURL: "https://firulais-app.firebaseio.com",
  projectId: "firulais-app",
  storageBucket: "firulais-app.appspot.com",
  messagingSenderId: "689840315607"
};
firebase.initializeApp(config);
export default firebase;