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
        console.log("Error: " + error);
    }) 
    return promise
}

function createService(mascotaId, fundacionId, userId, petObj, type, dateIni,dateFin){
    let images = petObj.imageUrls
    let imgURL = images[Object.keys(images)[0]].url
    let key = firebase.database().ref().child('services').push().key
    firebase.database().ref().child('services/'+key).update({
        type: type,
        petId: mascotaId,
        petInfo: petObj,
        founId: fundacionId,
        userId: userId,
        status: 'pendiente',
        thumbnail: imgURL,
        dateIni: dateIni,
        dateFin: dateFin
    }).then(res=>{
        Alert.alert('Success','Se creó un servicio con éxito')
    })
    .catch(err=>{
        console.log('Error Crear Servicio',err)
        Alert.alert('Connection Error','No se pudo crear el servicio')
    })
}

const usersActions = {
    fetchAllUsers,
    createService,
    fetchByUID
}

export default usersActions