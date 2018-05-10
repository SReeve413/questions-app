import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyCi-FJPhilRhEpsTN7dltOQdvxC9PqELBY",
    authDomain: "fir-chat-169e0.firebaseapp.com",
    databaseURL: "https://fir-chat-169e0.firebaseio.com",
    projectId: "fir-chat-169e0",
    storageBucket: "fir-chat-169e0.appspot.com",
    messagingSenderId: "489203017475"
};
const app = firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

export const snapshotToArray = (snapshot) => {
    let returnArr = []
    snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item)
    });
    return returnArr
}

export {
    app
}