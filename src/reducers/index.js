import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
//Import all reducers here
import currentUserReducer from './currentUser'
import drawerStateReducer from './drawerState'


const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  form: formReducer,
  drawerState: drawerStateReducer,
})

export default rootReducer
