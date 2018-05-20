import firebase from '../firebase/firebaseSingleton'

let db = firebase.database();
let ref = db.ref('users');

function fetchAllFoundations() {
    let promise = ref.orderByChild("type").equalTo("fundation").once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + error);
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
        console.log("Error: " + error);
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
        console.log("Error: " + error);
    }) 
    return promise
}

const foundationsActions = {
    fetchAllFoundations,
    fetchFoundationPets,
    fetchByUID
}

export default foundationsActions