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
function reportFoundation(userId, fundacionId){
    let dbRef = ref.child(fundacionId)
    dbRef.child('reportes/'+userId).update({
        userId: userId,
        dateReported: new Date()
    })
}

function deleteProfileFoundation(fundacionId){
    let dbRef = ref.child(fundacionId)
    dbRef.update({
        profile: null,
        bannedProfile: new Date(),
        reportes: null
    })
}

function deletePetFoundation(petId,fundId,numberImages){
    let dbRef = db.ref('pets').child(petId)
    let storeRef = firebase.storage().ref(`images/pets/${petId}`)
    let fundRef = ref.child(fundId)
    fundRef.update({
        bannedPet: new Date(),
        reportes: null
    }).catch((err)=>{
        console.log('Error: ' + err)
    })

    dbRef.remove().catch((err)=>{
        console.log('Error: ' + err)
    })
    for (let index = 0; index < numberImages; index++) {
        storeRef.child(`P-${index}`).delete().catch((err)=>{
            console.log('Error: ' + err)
        })
    }


}

function deleteNewsFoundation(newsId,fundId,numberImages){
    let dbRef = db.ref('news').child(newsId)
    let storeRef = firebase.storage().ref(`images/news/${newsId}`)
    let fundRef = ref.child(fundId)
    fundRef.update({
        bannedNews: new Date(),
        reportes: null
    }).catch((err)=>{
        console.log('Error: ' + err)
    })
    
    dbRef.remove().catch((err)=>{
        console.log('Error: ' + err)
    })
    for (let index = 0; index < numberImages; index++) {
        storeRef.child(`P-${index}`).delete().catch((err)=>{
            console.log('Error: ' + err)
        })
    }

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
    fetchByUID,
    reportFoundation,
    deleteProfileFoundation,
    deletePetFoundation,
    deleteNewsFoundation
}

export default foundationsActions