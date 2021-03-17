import Firebase from 'firebase';

const firebaseConfig ={
    apiKey:'AIzaSyDVKz9hNf4_pWTpDxyFdYqcH2laVPwm9LM',
    databaseURL: 'https://mychat-32e6d-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId:'mychat-32e6d',
    appID:'1:394453227714:android:5fbe511f7fe1c02c9c035b',
};

export default Firebase.initializeApp(firebaseConfig);