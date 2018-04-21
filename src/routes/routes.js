import React from 'react'
import {Platform, Dimensions} from 'react-native'
import { StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'

//Screens
import {scale} from '../lib/responsive'
import ProfileView from '../Views/profile/ProfileView'
import Signin from '../Views/login/SigninView'

import Drawer from '../Components/Drawer'



const SignedOutRoutes = StackNavigator({
  Signin: {
    path: 'signin',
    screen: Signin
  }
}, {headerMode: 'none'})

const AllRoutes = StackNavigator({
  Profile:{
    screen: ProfileView
  }
},{headerMode: 'none'})

const {width} = Dimensions.get('window');
const drawerWidth = width * 0.87

if (Platform.OS === 'ios') {
  drawerWidth = scale(300)
}

const SignedInRoutes = DrawerNavigator({
  AllRoutes:{
    screen: AllRoutes
  }
}, {contentComponent: Drawer, drawerWidth: drawerWidth})

export {
  SignedOutRoutes,
  SignedInRoutes,
}
