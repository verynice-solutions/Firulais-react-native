import {SET_DRAWER_STATE} from '../utils/constants'

function setDrawerState(activeView = 'Home'){
  return {
    type: SET_DRAWER_STATE,
    activeView: activeView
  }
}
const drawerActions = {
  setDrawerState
}

export default drawerActions