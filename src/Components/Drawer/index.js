import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform } from 'react-native'
import {NavigationActions} from 'react-navigation';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo, FontAwesome, MaterialIcons, Foundation } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux'

const {height, width} = Dimensions.get('window');
import Images from '../../../assets/images'
import {scale} from '../../lib/responsive'
import drawerActions from '../../actions/drawerActions'
import Divider from '../Divider'
class Drawer extends React.Component {

  constructor(props) {
    super(props)
    this.goToRoot = this.goToRoot.bind(this)
  }

  navigateToScreen = (routeName)=> {
    return ()=> {
      let {navigate} = this.props.navigation
      navigate(routeName)
      // this.props.navigation.dispatch(this.goToRoot(routeName))
      this.props.setDrawer(routeName)
    }
  }

  goToRoot(root){
    let {navigate} = this.props.navigation
    const go = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: root})
      ]
    })
    return go
  }

  render() {

    let {activeItemKey} = this.props.navigation
    // console.log("activeItem: ", this.props.navigation)
    // console.log("drawerState: ",this.props.drawerState.activeView)
    let {activeView} = this.props.drawerState

    return (<Grid style={styles.drawerContainer}>
              <Row style={styles.header}>
                <Col style={{justifyContent: 'center'}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center',alignItems:'center', paddingTop: scale(60)}}>
                  <Image resizeMode="contain" source={Images.firulais_logo}/>
                  </View>
                  <View style={{flexDirection: 'row', paddingLeft: scale(20), marginTop: scale(20), paddingBottom: scale(20) }}>
                    {/* <Text style={{fontSize: scale(13), color: 'black', backgroundColor: 'transparent', opacity: 0.95}} >Welcome back ,</Text>
                    <Text style={{ fontSize: scale(13), color:'#fff', backgroundColor: 'transparent', opacity: 0.95}}> 
                      {this.props.currentUser.username}
                    </Text> */}
                  </View>
                </Col>
              </Row>
              <Divider />
              <Divider />
              <Row style={styles.drawerContent}>
                <Col>
                  <Ripple style={[styles.drawerItem, activeView=='Home'?styles.activeItem:null ]} onPress={this.navigateToScreen('Home')} >
                    <Entypo name="home" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Home</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='SearchPartiesProviders'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('SearchPartiesProviders')}>
                    <FontAwesome name="newspaper-o" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Eventos</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='SearchCasesIntakes'?styles.activeItem:null]} 
                    onPress={this.navigateToScreen('SearchCasesIntakes')}>
                    <Foundation name="guide-dog" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Solicitudes</Text>
                  </Ripple>

                  <Ripple style={[styles.drawerItem, activeView=='CalendarView'?styles.activeItem:null]} onPress={this.navigateToScreen('CalendarView')}>
                    <FontAwesome name="history" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
                    <Text style={styles.drawerItemText}>Historial</Text>
                  </Ripple>

                </Col>
              </Row>
              <Row style={styles.drawerFooter}>
                <Col>
                  <Ripple style={[styles.drawerItem,activeView=='Settings'?styles.activeItem:null]} onPress={this.navigateToScreen('Settings')}>
                    <MaterialIcons name="settings" size={scale(24)} color="rgb(75, 75, 73)" style={styles.drawerItemIcon}/>
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
    height: scale(140)
  },
  drawerContent: {
    backgroundColor: '#fafafa',
    marginTop: scale(11),
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
    paddingLeft: scale(20)
  },
  drawerItemIcon: {
    flex:0.15,
    marginRight: scale(40)
  },
  drawerItemText: {
    flex:1,
    fontFamily:'Roboto-Medium',
    fontSize: scale(16),
    textAlign: 'left'
  },
  activeItem: {
    backgroundColor: '#e4e5e9'
  },
}
