import firebase from '../firebase/firebaseSingleton'

let db = firebase.database();
let ref = db.ref('users');

function fetchAllFoundations() {
    return ref.orderByChild("type").equalTo("fundation").once("value", function(snapshot) {
        return snapshot.val()
    })      

}

const foundationsActions = {
    fetchAllFoundations
}

export default foundationsActions