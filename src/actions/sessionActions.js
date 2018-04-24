import {SET_CURRENT_USER,SET_SIGN_IN_DATA} from '../utils/constants'
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
  return dispatch => {
    dispatch(setCurrentUser({ accessToken: '', idToken: '', user:{} }))
  }
}

const sessionActions = {
  setCurrentUser,
  setSignInData,
  signOut
};

export default sessionActions;
