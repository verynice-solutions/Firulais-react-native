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

const foundationsActions = {
    fetchAllFoundations
}

export default foundationsActions