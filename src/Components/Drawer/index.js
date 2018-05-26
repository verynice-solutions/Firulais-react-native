import React from 'react';
import { StyleSheet, View, Image, Dimensions, Platform, TouchableOpacity } from 'react-native'
import {NavigationActions} from 'react-navigation';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
              <Ripple onPress={this.props.currentUser.type==='user'?
                this.navigateToScreen('UserProfile',{ userID: this.props.currentUser.uid }):
                this.navigateToScreen('FoundationProfile',{ foundationID: this.props.currentUser.uid })
                }>
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

              {/* <Image resizeMode="contain" style={{height:moderateScale(100),width:moderateScale(120)}} source={Images.firulais_logo}/> */}

              <Row style={styles.drawerContent}>
                <Col>
                  <Ripple style={[styles.drawerItem, activeView=='Home'?styles.activeItem:null ]} 
                    onPress={this.navigateToScreen('Home')} >
                    <Entypo name="home" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Inicio</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllFoundationsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllFoundationsView')}>
                    <Ionicons name="md-hand" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Fundaciones</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllUsersView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllUsersView')}>
                    <Ionicons name="md-people" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Voluntarios</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='MyServicesView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('MyServicesView')}>
                    <Ionicons name="md-paw" size={moderateScale(22)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Solicitudes</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='AllNewsView'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('AllNewsView')}>
                    <MaterialCommunityIcons name="newspaper" size={moderateScale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Noticias</Text>
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
