import firebase from '../firebase/firebaseSingleton'
import {Alert} from 'react-native'

let db = firebase.database();
let refServices = db.ref('services');

function fetchAllServices(userId) {
    let promise = refServices.orderByChild("founId").equalTo(userId).once("value")
    .then( (snapshot)=> {
        return snapshot.val()
    }) 
    .catch(err=>{
        console.log("Error: " + error);
    }) 
    return promise
}

function fetchUserServices(userId) {
    let promise = refServices.orderByChild("userId").equalTo(userId).once("value")
    .then( (snapshot)=> {
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
  let key = refServices.push().key
  refServices.child(key).update({
      servId:key,
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

function updateStatus(serviceKey,statusValue){
    refServices.child(serviceKey).update({
        status: statusValue,
    }).then(res=>{
        Alert.alert('Success','nuevo estado del servicio: '+statusValue)
    })
    .catch(err=>{
        console.log('Error Crear Servicio',err)
        Alert.alert('Connection Error', err)
    })
}


const serviciosActions = {
    updateStatus,
    fetchAllServices,
    fetchUserServices,
    createService,
}

export default serviciosActions