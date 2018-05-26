import firebase from '../firebase/firebaseSingleton'

let db = firebase.database();
let ref = db.ref('pets');

function fetchPetById(petId) {
  let pidRef =  ref.child(petId);
  let promise = pidRef.once("value")
  .then( (snapshot)=> {
      return snapshot.val()
  }) 
  .catch(err=>{
      console.log("Error: " + err);
  }) 
  return promise
}

function fetchFoundationPets(uid) {
  let promise = ref.orderByChild("idFundacion").equalTo(uid).once("value")
  .then( (snapshot)=> {
      return snapshot.val()
  }) 
  .catch(err=>{
      console.log("Error: " + err);
  }) 
  return promise
}

const foundationsActions = {
  fetchPetById,
  fetchFoundationPets
}

  export default foundationsActions