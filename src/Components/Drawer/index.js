import React from 'react';
import { StyleSheet, View, Image, Dimensions, Platform, TouchableOpacity } from 'react-native'
import {NavigationActions} from 'react-navigation';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo, FontAwesome, MaterialIcons, Foundation, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux'
import {Thumbnail,ListItem,Left,Right,Body,Text} from 'native-base'
const {height, width} = Dimensions.get('window');
import Colors from '../../utils/Colors'
import {randomPuppers} from '../../utils/random_functions'
import Images from '../../../assets/images'
import {moderateScale} from '../../lib/responsive'
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
              <Ripple onPress={this.navigateToScreen('EditProfile')}>
                <ListItem avatar
                  style={{backgroundColor:'white',borderBottomWidth: 0,paddingTop:30}}
                  itemDivider
                  >
                  
                  <Left>
                    <Thumbnail source={{uri: user.photoUrl||randomPuppers()}} />
                  </Left>
                  <Body style={{borderBottomWidth: 0}}>
                    <Text style={{fontSize: moderateScale(14), fontFamily:'Roboto-Medium', color: Colors.purple}}>
                      {user.name||'Firulais'}
                    </Text>
                    <Text note style={{ fontSize: moderateScale(14), fontFamily:'Roboto', color: Colors.light_purple }}> 
                      {user.email}    </Text>
                  </Body>
                  <Right style={{borderBottomWidth: 0}}>
                    <MaterialIcons name="edit" size={moderateScale(22)} color={Colors.purple} />
                  </Right>

                </ListItem> 
              </Ripple> 
              <Divider/>
              {/* <Row style={styles.header}>
                <Col style={{}}>

                  <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingBottom:moderateScale(8)}}>
                    <TouchableOpacity style={{flex:0.4,flexDirection:'row',justifyContent: 'flex-start',alignItems:'flex-end'}} 
                      onPress={this.navigateToScreen('EditProfile')}>
                      <Thumbnail source={{uri: user.photoUrl||randomPuppers()}} />
                    </TouchableOpacity>
                    <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end', alignItems:'flex-start'}} >
                      <Image resizeMode="contain" style={{height:moderateScale(100),width:moderateScale(120)}} source={Images.firulais_logo}/>
                    </View>
                  </View>

                 
                  <TouchableOpacity style={{flexDirection: 'row'}} 
                    onPress={this.navigateToScreen('EditProfile')}>
                    <View style={{flex:1,flexDirection: 'column'}}>
                      <Text style={{fontSize: moderateScale(14), fontFamily:'Roboto-Medium', color: Colors.purple, backgroundColor: 'transparent', opacity: 0.95, paddingBottom:moderateScale(1)}}>
                        {user.name||'Firulais'}</Text>
                      <Text style={{ fontSize: moderateScale(14), fontFamily:'Roboto', color: Colors.light_purple, backgroundColor: 'transparent', opacity: 0.95}}> 
                        {user.email}    </Text>
                    </View>
                    <View style={{flex:0.1,flexDirection: 'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                      <MaterialIcons name="edit" size={moderateScale(22)} color={Colors.purple} />
                    </View>
                  </TouchableOpacity>

                </Col>
              </Row> */}

              <Row style={styles.drawerContent}>
                <Col>
                  <Ripple style={[styles.drawerItem, activeView=='Home'?styles.activeItem:null ]} 
                    onPress={this.navigateToScreen('Home')} >
                    <Entypo name="home" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Home</Text>
                  </Ripple>

                  {
                    this.props.currentUser.type === 'user' ? (
                        <Ripple style={[styles.drawerItem, activeView=='UserProfile'?styles.activeItem:null]} 
                        onPress={this.navigateToScreen('UserProfile',{ userID: this.props.currentUser.uid }) }>
                        <Ionicons name="md-person" size={moderateScale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                        <Text style={styles.drawerItemText}>Mi Perfil</Text>
                      </Ripple>
                    ):(
                      <Ripple style={[styles.drawerItem, activeView=='FoundationProfile'?styles.activeItem:null]} 
                        onPress={this.navigateToScreen('FoundationProfile',{ foundationID: this.props.currentUser.uid }) }>
                        <Ionicons name="md-person" size={moderateScale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                        <Text style={styles.drawerItemText}>Mi Perfil</Text>
                      </Ripple>
                    )
                  }
                  <Ripple style={[styles.drawerItem, activeView=='AllUsersView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllUsersView')}>
                    <Ionicons name="md-people" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Personas</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllFoundationsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllFoundationsView')}>
                    <Ionicons name="md-hand" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Fundaciones</Text>
                  </Ripple>
                  
                  <Ripple style={[styles.drawerItem, activeView=='MyServicesView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('MyServicesView', {isFoundation: user.type==='fundation'})}>
                    <Ionicons name="md-paw" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>{user.type==='fundation'?'Solicitudes':'Servicios'}</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllNewsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllNewsView')}>
                    <Ionicons name="md-paper" size={moderateScale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Eventos</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='HistoryView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('HistoryView')}>
                    <MaterialIcons name="stars" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Historial</Text>
                  </Ripple>

                </Col>
              </Row>
              <Row style={styles.drawerFooter}>
                <Col>
                  <Ripple style={[styles.drawerItem,activeView=='Settings'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('Settings')}>
                    <MaterialIcons name="settings" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Opciones</Text>
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
  drawerWidth = moderateScale(300)
}

const styles = {
  header: {
    backgroundColor: '#f8f8ff',
    alignItems:'flex-end',
    height: moderateScale(140),
    paddingHorizontal: moderateScale(16),
    paddingTop: 24,
    marginBottom: moderateScale(6)
  },
  drawerContent: {
    backgroundColor: '#f8f8ff',
  },
  drawerFooter: {
    backgroundColor: '#f8f8ff',
    height: moderateScale(80)
  },
  drawerContainer: {
    width: drawerWidth,
    height: height,
    backgroundColor: "#fafafa",
  },
  drawerItem: {
    height: moderateScale(54),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16)
  },
  drawerItemIcon: {
    flex:0.15,
    marginRight: moderateScale(36)
  },
  drawerItemText: {
    flex:1,
    fontFamily:'Roboto-Medium',
    fontSize: moderateScale(14),
    textAlign: 'left'
  },
  activeItem: {
    backgroundColor: '#e4e5e9'
  },
}
