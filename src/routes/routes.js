import React from 'react'
import {Platform, Dimensions} from 'react-native'
import { StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'

//Screens
import {moderateScale} from '../lib/responsive'
import HomeView from '../Views/home'
import EditProfileView from '../Views/profile/EditProfile'
import LogInView from '../Views/signin/LogInView'
import SignUp from '../Views/signin/SignUp'
import ForgotPass from '../Views/signin/ForgotPass'
import Settings from '../Views/settings/Settings'
import Drawer from '../Components/Drawer'
import AddPetScreen from '../Views/profile/fundation/AddPet'
import AllFoundationsView from '../Views/allUsers/FoundationsView'
import AllUsersView from '../Views/allUsers/UsersView'
import FoundationProfile from '../Views/profile/fundation/FoundationProfile'
import UserProfile from '../Views/profile/user/UsersProfile'
import MyServicesView from '../Views/services/MyServicesView'
import CreateService from '../Views/services/CreateService'
import AddNewView from '../Views/news/createNew'
import AllNewsView from '../Views/news/index'
import NewsView from '../Views/news/newsView'
import HistoryView from '../Views/services/History'
import FinishedService from '../Views/services/FinishedService'

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
  CreateService:{
    path:'createService',
    screen: CreateService
  },
  MyServicesView: {
    path: 'myServicesView',
    screen: MyServicesView
  },
  AllFoundationsView: {
    path: 'foundationsView',
    screen: AllFoundationsView
  },
  FoundationProfile: {
    path: 'foundationProfile',
    screen: FoundationProfile
  },
  NewsView: {
    path: 'newsView',
    screen: NewsView
  },
  AllUsersView: {
    path: 'usersView',
    screen: AllUsersView
  },
  UserProfile: {
    path: 'userProfile',
    screen: UserProfile
  },
  AllNewsView: {
    path: 'allNewsView',
    screen: AllNewsView
  },
  AddPet:{
    path: 'addpet',
    screen: AddPetScreen
  },
  AddNew:{
    path: 'addNew',
    screen: AddNewView
  },
  HistoryView:{
    path: 'historyView',
    screen: HistoryView
  },
  FinishedService: {
    path: 'finishedService',
    screen: FinishedService
  },
  Settings: {
    path: 'settings',
    screen: Settings
  }
},{
  navigationOptions:{
    headerStyle:{
      marginTop: Platform.OS === 'android'? -28:0
    },
  }
})

const {width} = Dimensions.get('window');
const drawerWidth = width * 0.87

if (Platform.OS === 'ios') {
  drawerWidth = moderateScale(300)
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
