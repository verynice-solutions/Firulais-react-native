import {SET_CURRENT_USER,SET_SIGN_IN_DATA} from '../utils/constants'
function setCurrentUser( currentUser ) {
  return {
    type: SET_CURRENT_USER,
    currentUser: currentUser,
  }
}

function setSignInData( signInData ) {
  return {
    type: SET_SIGN_IN_DATA,
    signInData: signInData,
  }
}

function signOut() {
  CacheStore.remove("currentUser")
  return dispatch => {
    dispatch(setCurrentUser({token: null, loadedFromCache: true}))
  }
}

const sessionActions = {
  setCurrentUser,
  setSignInData,
  signOut
};

export default sessionActions;
