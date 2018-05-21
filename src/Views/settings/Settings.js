/**
 * Needless MobileApp
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import {connect} from 'react-redux'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import {Button, Icon} from 'native-base'

import Colors from '../../utils/Colors'
import versionApp from '../../utils/version'
//Actions
import sessionActions from '../../actions/sessionActions'
import Images from '../../../assets/images'

class Settings extends Component{
  constructor(props) {
    super(props)
    this.onPressSignout = this.onPressSignout.bind(this)
  }
	static navigationOptions = ({navigation}) => {
		return{
			title: 'Opciones',
    }
  }
  onPressSignout= ()=>{
    this.props.signOut()
  }
  render() {
    let {user} = this.props.currentUser
    return (
      <View style={{flex:1}}>
        <View style={styles.top}>
          <View/>
          <Image style={{flex:1}} resizeMode='contain'
          source={Images.firulais_logo} />
          <View>
            <Text style={styles.version}>Version:
              <Text style={{fontWeight:'normal'}}> firulais {versionApp.version}. </Text>
            </Text>
            <View style={{flex:0.06}}/>
          </View>
        </View>
        <View style={styles.bottom}>
          {/* <Text style={styles.text}> Toma! lleva esto contigo {'❤'}  </Text> */}
            <TouchableOpacity style={{flexDirection:'row'}}>
              <MaterialIcons style={styles.icons} name='star'/>
              <Text style={styles.text}>{user.gender!='male'?'Logeado':'Logeada'} como
                <Text style={{color: Colors.pinkyRed,fontWeight: "500"}}>
                  {' '} {user.givenName||user.email}
                </Text>
              </Text>
              
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row',paddingVertical:20}} onPress={ this.onPressSignout }>
              <Entypo style={styles.icons} name='log-out'/>
              <Text style={styles.text}>Cerrar sesión. </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}


function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser
  }
}

export default connect(mapStateToProps, {
  signOut: sessionActions.signOut,
})(Settings)

const styles = StyleSheet.create({
  top: {
    flex: 0.37,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efeff4',
    elevation: 1
  },
  bottom: {
    flex: 0.63,
    flexDirection:'column',
    backgroundColor: 'white',
    paddingTop: 15,
    paddingHorizontal: 20
  },
  version:{
    color: Colors.greyishBrown,
    fontFamily: "Roboto",
    fontSize: 14.7,
    fontWeight: "bold",
    textAlign:'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  icons:{
    textAlign: 'center',
    color: Colors.greyishBrown,
    fontSize: 20,
    paddingRight: 12
  },
  text:{
    textAlign:'center',
    color: Colors.greyishBrown,
    fontFamily: "Roboto",
    fontSize: 14.7,
    fontWeight: "normal",
    fontStyle: "normal",
  }
});
