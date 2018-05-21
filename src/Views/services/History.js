import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Textarea } from 'native-base';
import Modal from 'react-native-modal'
import StarRating from 'react-native-star-rating';
import serviceActions from '../../actions/serviceActions'

class MyServicesView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allServices: [],
      isDetailVisible: false,
      serviceInModal: null
    }
    this._reviewService = this._reviewService.bind(this)
  }

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    let titleTop = 'Historial'
		return{
			title: titleTop
    }
  }
  
  componentDidMount() {
    this._fetchAll()
  }

  _toggleModal = () =>
  this.setState({ isDetailVisible: !this.state.isDetailVisible, starSelected:null, ratingDesc:''});

  _fetchAll = ()=>{
    this.setState({fetching: true})
    if(this.props.currentUser.type==='fundation'){
      serviceActions.fetchAllServices(this.props.currentUser.uid).then( (val) =>{
        this.setState({allServices: val, fetching:false})
      })
    }else{
      serviceActions.fetchUserServices(this.props.currentUser.uid).then( (val) =>{
        this.setState({allServices: val, fetching:false})
      })
    }
  }

  _reviewService(key,status){
    if(this.props.currentUser.type==='fundation'){
      serviceActions.updateStatus(key,status)
      this._fetchAll()
      this._toggleModal()
    }
  }

	render() {
    const { navigate } = this.props.navigation
    let services = this.state.allServices
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else{
      return (
        <View style={{flex:1}}> 
          <List>
            {
              services?(
                Object.keys(services).map((i)=>{
                  return (services[i].status == 'rechazado' || services[i].status == 'finalizado') && (
                      <ListItem key={i} onPress={ ()=> navigate('FinishedService', { serviceKey:i, serviceInModal: services[i] }) }>
                        <Thumbnail square size={80} source={{ uri: services[i].thumbnail }} />
                        <Body>
                          <Text>{services[i].petInfo.tempName}</Text>
                          <Text note> {services[i].type}</Text>
                        </Body>
                        <Text> {services[i].status}</Text>
                      </ListItem>
                    )
                  
                })
              ):(
                <Text>No Servicios :( </Text>
              )
            }
          </List>
        </View>
      )
    }
  }
}
{/*
  <ListItem key={i}>
<Thumbnail square size={80} source={{ uri: services[i].thumbnail }} />
<Body>
  <Text>HI</Text>
  <Text note> {services[i].petId}</Text>
</Body>
</ListItem> */}
function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(MyServicesView)

const styles = StyleSheet.create({
  ModalContainer:{
    flex: 0.8,
    flexDirection:'column', 
    backgroundColor:'white',
    justifyContent:'space-around'
  }
});