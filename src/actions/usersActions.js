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

const usersActions = {
    fetchAllUsers
}

export default usersActions