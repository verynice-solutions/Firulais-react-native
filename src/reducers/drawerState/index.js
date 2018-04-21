import {SET_DRAWER_STATE} from '../../utils/constants'
import initialState from './initialState'

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DRAWER_STATE:
      return{
        activeView: action.activeView
      }
    default:
      return state;
  }
};