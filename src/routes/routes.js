import React from 'react'
import {Platform, Dimensions} from 'react-native'
import { StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'

//Screens
import {scale} from '../lib/responsive'
import HomeView from '../Views/home'
import EditProfileView from '../Views/profile/EditProfile'
import LogInView from '../Views/signin/LogInView'
import SignUp from '../Views/signin/SignUp'
import ForgotPass from '../Views/signin/ForgotPass'
import Settings from '../Views/settings/Settings'
import Drawer from '../Components/Drawer'
import AddPetScreen from '../Views/profile/fundation/AddPet'


const SignedOutRoutes = StackNavigator({
  Login: {
    path: 'login',
    screen: LogInView
  },
  SignUp: {
    path: 'signup',
    screen: SignUp
  },
  Forgot: {
    path: 'forgot_password',
    screen: ForgotPass
  }
}, {headerMode: 'none'})

const AllRoutes = StackNavigator({
  Home: {
    path: 'home',
    screen: HomeView
  },
  EditProfile:{
    path: 'editarperfil',
    screen: EditProfileView
  },
  AddPet:{
    path: 'addpet',
    screen: AddPetScreen
  },
  Settings: {
    path: 'settings',
    screen: Settings
  }
})

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
