import firebase from '../firebase/firebaseSingleton'

let db = firebase.database();
let ref = db.ref('users');

function fetchAllFoundations() {
    let promise = ref.orderByChild("type").equalTo("fundation").once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
    }) 
    return promise
}

function fetchAllUserFoundations(userId) {
    let promise = ref.child(userId+"/fundaciones").once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
    }) 
    return promise
}

function fetchFoundationPets(uid) {
    let petsRef = db.ref('pets')
    let promise = petsRef.orderByChild("idFundacion").equalTo(uid).once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
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

function fetchFoundationNews(uid) {
    let dRef = db.ref('news')
    let promise = dRef.orderByChild("idFundacion").equalTo(uid).once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + err);
    }) 
    return promise
}

const foundationsActions = {
    fetchAllFoundations,
    fetchAllUserFoundations,
    fetchFoundationPets,
    fetchFoundationNews,
    fetchByUID
}

export default foundationsActions