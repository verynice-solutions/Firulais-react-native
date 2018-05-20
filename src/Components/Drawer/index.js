import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform, TouchableOpacity } from 'react-native'
import {NavigationActions} from 'react-navigation';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo, FontAwesome, MaterialIcons, Foundation, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux'
import {Thumbnail} from 'native-base'
const {height, width} = Dimensions.get('window');
import Colors from '../../utils/colors'
import {randomPuppers} from '../../utils/random_functions'
import Images from '../../../assets/images'
import {scale} from '../../lib/responsive'
import drawerActions from '../../actions/drawerActions'
import Divider from '../Divider'
class Drawer extends React.Component {

  constructor(props) {
    super(props)
    this.goToRoot = this.goToRoot.bind(this)
  }

  navigateToScreen = (routeName,obj)=> {
    return ()=> {
      let {navigate} = this.props.navigation
      navigate(routeName, obj)
      // this.props.navigation.dispatch(this.goToRoot(routeName))
      this.props.setDrawer(routeName)
    }
  }
  goToRoot(root, obj){
    let {navigate} = this.props.navigation
    const go = NavigationActions.reset({
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

  render() {
    // let {activeItemKey} = this.props.navigation
    // console.log("activeItem: ", this.props.navigation)
    // console.log("drawerState: ",this.props.drawerState.activeView)
    let {activeView} = this.props.drawerState
    let {user} = this.props.currentUser
    return (<Grid style={styles.drawerContainer}>
              <Row style={styles.header}>
                <Col style={{}}>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingBottom:scale(8)}}>
                    <TouchableOpacity style={{flex:0.4,flexDirection:'row',justifyContent: 'flex-start',alignItems:'flex-end'}} 
                      onPress={this.navigateToScreen('EditProfile')}>
                      <Thumbnail source={{uri: user.photoUrl||randomPuppers()}} />
                    </TouchableOpacity>
                    <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end', alignItems:'flex-start'}} >
                      {/* <Image resizeMode="contain" style={{height:scale(100),width:scale(120)}} source={Images.firulais_logo}/> */}
                    </View>
                  </View>
                  <TouchableOpacity style={{flexDirection: 'row'}} 
                    onPress={this.navigateToScreen('EditProfile')}>
                    <View style={{flex:1,flexDirection: 'column'}}>
                      <Text style={{fontSize: scale(14), fontFamily:'Roboto-Medium', color: Colors.purple, backgroundColor: 'transparent', opacity: 0.95, paddingBottom:scale(1)}}>
                        {user.name||'Firulais'}</Text>
                      <Text style={{ fontSize: scale(14), fontFamily:'Roboto', color: Colors.light_purple, backgroundColor: 'transparent', opacity: 0.95}}> 
                        {user.email}    </Text>
                    </View>
                    <View style={{flex:0.1,flexDirection: 'column',justifyContent:'flex-end',alignItems:'flex-end'}}>
                      <MaterialIcons name="edit" size={scale(22)} color={Colors.purple} />
                    </View>
                  </TouchableOpacity>

                </Col>
              </Row>
              <Divider />
              <Divider />
              <Row style={styles.drawerContent}>
                <Col>
                  <Ripple style={[styles.drawerItem, activeView=='Home'?styles.activeItem:null ]} 
                    onPress={this.navigateToScreen('Home')} >
                    <Entypo name="home" size={scale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Home</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllNewsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllNewsView')}>
                    <Ionicons name="md-paper" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Eventos</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='MyServicesView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('MyServicesView', {isFoundation: user.type==='fundation'})}>
                    <Foundation name="guide-dog" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>{user.type==='fundation'?'Solicitudes':'Servicios'}</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllFoundationsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllFoundationsView')}>
                    <Ionicons name="md-paw" size={scale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Fundaciones</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllUsersView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllUsersView')}>
                    <Ionicons name="md-people" size={scale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Personas</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='CalendarView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('CalendarView')}>
                    <MaterialIcons name="stars" size={scale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Historial</Text>
                  </Ripple>

                </Col>
              </Row>
              <Row style={styles.drawerFooter}>
                <Col>
                  <Ripple style={[styles.drawerItem,activeView=='Settings'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('Settings')}>
                    <MaterialIcons name="settings" size={scale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Settings</Text>
                  </Ripple>
                </Col>
              </Row>
           </Grid>)
  }

}

function mapStateToProps({currentUser,drawerState}) {
  return {
    currentUser: currentUser,
    drawerState: drawerState
  }
}

export default connect(mapStateToProps,{
  setDrawer: drawerActions.setDrawerState,
})(Drawer)


const drawerWidth = width * 0.87

if (Platform.OS === 'ios') {
  drawerWidth = scale(300)
}

const styles = {
  header: {
    backgroundColor: '#f8f8ff',
    alignItems:'flex-end',
    height: scale(140),
    paddingHorizontal: scale(16),
    paddingTop: 24,
    marginBottom: scale(6)
  },
  drawerContent: {
    backgroundColor: '#fafafa',
    marginTop: scale(6),
  },
  drawerFooter: {
    height: scale(80)
  },
  drawerContainer: {
    width: drawerWidth,
    height: height,
    backgroundColor: "#fafafa",
  },
  drawerItem: {
    height: scale(54),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: scale(16)
  },
  drawerItemIcon: {
    flex:0.15,
    marginRight: scale(36)
  },
  drawerItemText: {
    flex:1,
    fontFamily:'Roboto-Medium',
    fontSize: scale(14),
    textAlign: 'left'
  },
  activeItem: {
    backgroundColor: '#e4e5e9'
  },
}
