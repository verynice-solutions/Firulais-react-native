import { NavigationActions } from 'react-navigation';

// let _navigator;

// function setTopLevelNavigator(navigatorRef) {
//   _navigator = navigatorRef;
// }

function navigateTo(routeName, params) {
  let _navigator = NavigationActions.dispatch(
    NavigationActions.navigate({
      type: NavigationActions.NAVIGATE,
      routeName,
      params,
    })
  );
  return _navigator
}
function navigateToRoot(root,obj){ 
 let go = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ 
        routeName: root , 
        params: obj
      })
    ]
  })
  return go
}
// add other navigation functions that you need and export them

export default {
  navigateTo,
  // setTopLevelNavigator,
  navigateToRoot
};