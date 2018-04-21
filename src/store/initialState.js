// 1. Import initial state from each reducers

import currentUserInitialState from '../reducers/currentUser/initialState'
import drawerStateInitialState from '../reducers/drawerState/initialState'

// 2. Add a key as the name in the store and initialState of the component as value
export default function getInitialState() {
  return {
    currentUser: currentUserInitialState,
    drawerState: drawerStateInitialState,
  }
}
