import firebase from '../firebase/firebaseSingleton'


const databaseRef = firebase.database().ref('users/')
//const querybaseRef = querybase.ref(databaseRef, [])

function fetchAllFoundations() {
    console.log("PERRA");
    console.log("Firebase",databaseRef);
    //console.log(querybaseRef.where({ type: 'user'}))
    // firebase.database().ref('users/').
    return dispatch => {

    }
    
    // firebase.database().ref('/fundaciones').once('value').then(function(snapshot) {
    //     let foundations = snapshot.val()
    // });
}

const foundationsActions = {
    fetchAllFoundations
}

export default foundationsActions