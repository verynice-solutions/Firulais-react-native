import {SET_CURRENT_USER,SET_SIGN_IN_DATA} from '../utils/constants'
import CacheStore from 'react-native-cache-store';
import firebase from '../firebase/firebaseSingleton'

function setCurrentUser( currentUser ) {
  return {
    type: SET_CURRENT_USER,
    currentUser: currentUser,
  }
}

function setUserInfo( user_info ) {
  return (dispatch, getState)=>{
    let old_user = getState().currentUser
    let new_user = {
      ...old_user,
      user:{
        ...old_user.user,
        profile:{...user_info}
      }
    }
    dispatch( storeCurrentUser(new_user) )
  }
}

function updateUserDB(userId, object) {
  return  dispatch => {  
    firebase.database().ref('users/').child(userId).once('value')
      .then( (snapshot)=> {
      let exist = snapshot.val()
      if(!exist){
        // console.log('user doesnt exist',object)
        firebase.database().ref('users/' + userId).set(object)
        dispatch( storeCurrentUser({
          user: {...object},
          uid: userId,
          type: null
        }))
      }else{ 
        // console.log('user exist',exist)
        firebase.database().ref('users/' + userId).update(object)
        dispatch( storeCurrentUser({
          user: {...exist},
          uid: userId,
          type: exist.type
        }))
      }
    })
  }
}
function updateUserType(previousState, type) {
  return  dispatch => {  
    firebase.database().ref('users/' + previousState.uid).update({type:type})
    dispatch( storeCurrentUser({
      ...previousState, type: type
    }))
  }
}

function signOut() {
  CacheStore.remove('currentUser')
  firebase.auth().signOut()
  return dispatch => {
    dispatch(setCurrentUser({ user:{}, uid:'',type:'', loadedFromCache: false}))
  }
}
function storeCurrentUser( currentUser = {} ) {
  return dispatch => {
    CacheStore.set("currentUser", currentUser,525600)
    dispatch( setCurrentUser(currentUser) )
  }
}
function rehydrateCurrentUser() {
  return dispatch => {
    CacheStore.get("currentUser").then((currentUser) => {
      if (currentUser) {
        dispatch( setCurrentUser({...currentUser, loadedFromCache: true}) )
      } else {
        console.log('NO CURRENT USER',err)
        dispatch( signOut() )
      }
    }).catch(err=>{
      console.log('ERROR REHYDRATING USER',err)
    })
  }
}

const sessionActions = {
  setCurrentUser,
  setUserInfo,
  signOut,
  storeCurrentUser,
  rehydrateCurrentUser,
  updateUserDB,
  updateUserType
};

export default sessionActions;
