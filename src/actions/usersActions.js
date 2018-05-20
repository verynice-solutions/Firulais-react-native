import firebase from '../firebase/firebaseSingleton'
import {Alert} from 'react-native'

let db = firebase.database();
let ref = db.ref('users');

function fetchAllUsers() {
    let response = []
    let promise = ref.orderByChild("type").equalTo("user").once("value")
    .then(function(snapshot) {
        return snapshot.val()
    })  
    return promise
}

function fetchByUID(uid) {
    let uidRef =  ref.child(uid);
    let promise = uidRef.once("value")
    .then( (snapshot)=> {
        console
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
    }) 
    return promise
}

function addFoundationToUser(userId, fundacionId, name, thumb){
    let dbRef = ref.child(userId)
    dbRef.child('fundaciones/'+fundacionId).update({
        funId: fundacionId,
        name: name,
        thumbnail: thumb
    })
}

function fetchNNews(n) {
    let dbRef = db.ref('news');
    let promise = dbRef.limitToLast(n).once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
    }) 
    return promise
}

const usersActions = {
    fetchAllUsers,
    fetchByUID,
    fetchNNews,
    addFoundationToUser
}

export default usersActions