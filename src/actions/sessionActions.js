import {SET_CURRENT_USER,SET_SIGN_IN_DATA} from '../utils/constants'
import CacheStore from 'react-native-cache-store';
import firebase from '../firebase/firebaseSingleton'

function setCurrentUser( currentUser ) {
  return {
    type: SET_CURRENT_USER,
    currentUser: currentUser,
  }
}

function setSignInData( user ) {
  return {
    type: SET_SIGN_IN_DATA,
    user: user,
  }
}

function signOut() {
  CacheStore.remove('currentUser')
  firebase.auth().signOut()
  return dispatch => {
    dispatch(setCurrentUser({ accessToken: '', idToken: '', user:{}, loadedFromCache: false}))
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
        dispatch( signOut() )
      }
    })
  }
}

const sessionActions = {
  setCurrentUser,
  setSignInData,
  signOut,
  storeCurrentUser,
  rehydrateCurrentUser,
};

export default sessionActions;
