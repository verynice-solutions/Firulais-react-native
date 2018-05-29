import React, { Component } from 'react'

import { Platform,	Text,	View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import {connect} from 'react-redux'
import {Button, Icon} from 'native-base'
import {HeaderBackButton} from 'react-navigation'
import {Permissions} from 'expo'
import drawerActions from '../../actions/drawerActions'
import HomeFundation from './HomeFundation'
import HomeUser from './HomeUser'
import ChooseUser from './ChooseUser'
import AdminUser from './AdminUser'
import Imagess from '../../../assets/images'

class Home extends Component {
	constructor(props) {
    super(props);
  }
  static navigationOptions = ({navigation}) => {
		return{
      title: 'Inicio',
      
      headerLeft: (Platform.OS==='ios'?
        <Button transparent onPress={()=>navigation.navigate('DrawerOpen')}>
          <Icon name='menu' />
        </Button>
        :
        <HeaderBackButton buttonImage={Imagess.icon_menu} onPress={()=>navigation.navigate('DrawerOpen')} />
      )
    }
  }
  componentDidMount(){
    this.getCameraPermission()
      .then(() => {
        //success getting permissions!
      })
      .catch(()=>{
        //failing getting permissions!
      })
  }
  getCameraPermission= async ()=>{
    try{
      //ASK FOR CAMERA PERMISSION
      const cameraPermi = await Permissions.getAsync(Permissions.CAMERA);
      console.log('RESPONSE CAMERA PERMISSION:',cameraPermi.status)
      if (cameraPermi.status !== 'granted') {
        if (cameraPermi.status === 'denied' || cameraPermi.status === 'undetermined') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA);
        }else{
          if(status==='granted') this.setState({cameraGranted:true})
        }
      }else{ this.setState({cameraGranted:true})}
      //ASK FOR CAMERA_ROLL PERMISSION

      const camera_rollPermi = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      // console.log('RESPONSE CAMERA_ROLL PERMISSION:',camera_rollPermi)
      if (camera_rollPermi.status !== 'granted') {
        if (camera_rollPermi.status === 'denied' || camera_rollPermi.status === 'undetermined') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }else{
          if(status==='granted') this.setState({cameraGranted:true})
        }
      }else{ this.setState({cameraGranted:true})}
    }catch(error){
      Alert.alert(error.message)
    }
  }

	render() {
    let {currentUser} = this.props
    // console.log('user:',this.props.currentUser)
    if(currentUser.type){
      if(currentUser.type=='fundation'){
        return <HomeFundation navigation={this.props.navigation}/>
      }else if(currentUser.type=='user'){
        return <HomeUser navigation={this.props.navigation} />
      }else{
        return <AdminUser navigation={this.props.navigation} />
      }
    }else{
      return <ChooseUser navigation={this.props.navigation} />
    }
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps,{
  setDrawer: drawerActions.setDrawerState,
})(Home)
