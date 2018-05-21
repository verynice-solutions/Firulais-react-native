import { SET_CURRENT_USER, SET_SIGN_IN_DATA} from '../../utils/constants';
import initialState from './initialState';

export default function currentUser(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        ...action.currentUser
      }
    case SET_SIGN_IN_DATA:
      return {
        ...state,
        user: action.user
      }
    default:
      return state;
  }
}