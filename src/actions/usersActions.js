import firebase from '../firebase/firebaseSingleton'

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
        console.log("Error: " + error);
    }) 
    return promise
}

function createService(mascotaId, fundacionId, userId){
    let key = firebase.database().ref().child('services').push().key
    firebase.database().ref().child('services/'+key).update({
        petId: mascotaId,
        founId: fundacionId,
        userId: userId
    })
}

const usersActions = {
    fetchAllUsers,
    createService,
    fetchByUID
}

export default usersActions