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
        console.log("Error: " + err);
    }) 
    return promise
}

function createService(mascotaId, fundacionId, userId){
    let key = firebase.database().ref().child('services').push().key
    firebase.database().ref().child('services/'+key).update({
        petId: mascotaId,
        founId: fundacionId,
        userId: userId,
        status: 'pendiente'
    })
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
    createService,
    fetchByUID,
    fetchNNews,
    addFoundationToUser
}

export default usersActions