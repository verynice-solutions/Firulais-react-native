import { combineReducers } from 'redux'
//Import all reducers here
import currentUserReducer from './currentUser'
import drawerStateReducer from './drawerState'


const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  drawerState: drawerStateReducer,
})

export default rootReducer
