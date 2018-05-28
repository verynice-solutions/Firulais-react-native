import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, ScrollView,ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import Ripple from 'react-native-material-ripple'
import foundationsActions from '../../actions/foundationsActions'
//Style
import {Container, Content, Button, Text, Card, CardItem, ListItem, List, Body, Header, Left, Title,Thumbnail, Right,Icon} from 'native-base'
import images from '../../../assets/images'

class AdminUser extends Component {
	constructor(props) {
    super(props)
    this.state={
      allUsersReported: null,
      fetching: true,
    }
  }
  componentDidMount() {
    this._fetchReportedUsers()
  }
  
  _fetchReportedUsers = ()=>{
    this.setState({fetching:true})
    foundationsActions.fetchAllFoundations().then( (values) =>{
      //console.log("RESPONSE", val)
      if( _.some(values,(val)=> val.reportes) ){
        this.setState({allUsersReported: values, fetching:false})
      }else{
        this.setState({allUsersReported: null, fetching:false})
      }
    })
  }

	render() {
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else{
      let foundations = this.state.allUsersReported
      return (
        <View style={{flex:1}}> 
          <ScrollView>
            <View style={{flexDirection:'row',justifyContent:'space-around', marginBottom:10,marginTop:10}}>
              <Button onPress={()=>this._fetchReportedUsers()} iconLeft info>
                <Icon name='md-refresh' />
                <Text>Refrescar</Text>
              </Button>
            </View>
            <Text style={styles.textDefault}>Lista de fundaciones reportadas:</Text>
            <List>
              {
                foundations?(
                  Object.keys(foundations).map((i)=>{       
                    return(foundations[i].reportes)&&( 
                      <Ripple key={i} onPress={ ()=> this.props.navigation.navigate('FoundationProfile', { foundationID: i }) }>
                        <ListItem >
                          <Thumbnail rounded size={80} source={{ uri: foundations[i].photoUrl }} />
                          <Body>
                            <Text>{foundations[i].name}</Text>
                            <Text note>{foundations[i].profile && foundations[i].profile.description  } </Text>
                          </Body>
                        </ListItem>
                      </Ripple>
                    )
                  })
                ):(
                  <View style={{paddingTop:100,justifyContent:'center',alignItems:'center'}}>
                  <Image source={images.super_kitty} resizeMode= 'contain' 
                    style={{height: 150, width: 150}}/>
                  <Text style={{fontFamily:'Roboto-Bold',fontSize:18,marginTop:18}}> ¡ Genial ! </Text>
                  <Text style={{fontStyle:'italic',fontFamily:'Roboto-Bold',fontSize:18,marginTop:5}}> No hay ninguna fundación reportada.</Text>
                </View>
                )
              }
              </List>
            </ScrollView>
        </View>
      )
    }
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(AdminUser)

const styles = StyleSheet.create({
	textDefault:{ 
    fontFamily:'Roboto-Bold',
    fontSize:18,
		textAlign:'center',
		marginTop: 15,
	}
});