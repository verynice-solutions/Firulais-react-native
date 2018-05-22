import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Left } from 'native-base';
import Modal from 'react-native-modal'
import serviceActions from '../../actions/serviceActions'
import images from '../../../assets/images'

class MyServicesView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allServices: [],
      isDetailVisible: false,
      serviceInModal: null
    }
    this._detailService = this._detailService.bind(this)
    this._reviewService = this._reviewService.bind(this)
  }

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    let titleTop = params.isFoundation?'Solicitudes':'Servicios'
		return{
			title: titleTop
    }
  }
  
  componentDidMount() {
    this._fetchAll()
  }

  _toggleModal = () =>
  this.setState({ isDetailVisible: !this.state.isDetailVisible });

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

  _detailService(serviceObj){
    // console.log('servKey',serviceObj.servId)
    this.setState({ 
      isDetailVisible: !this.state.isDetailVisible,
      serviceInModal: serviceObj 
    })
  }

  _reviewService(key,status){
    if(this.props.currentUser.type==='fundation'){
      serviceActions.updateStatus(key,status)
      this._fetchAll()
      this._toggleModal()
    }
  }

	render() {
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
          {this.state.serviceInModal&&
          <Modal isVisible={this.state.isDetailVisible}
          onBackButtonPress={()=>this._toggleModal()}
          onBackdropPress={()=>this._toggleModal()}>

            <View>
              <ListItem itemDivider>
                <Left><Text style={styles.dividerText}>Información del voluntario</Text></Left>
              </ListItem>               
            </View>
            <View style={styles.ModalContainer}>

              <ListItem avatar noBorder>
                <Left>
                  <Thumbnail source={images.cat_selfi} />
                </Left>
                <Body>
                  <Text>Nombre del Voluntario</Text>
                  <Text note>Info del voluntario</Text>
                </Body>
              </ListItem>

              <ListItem itemDivider>
                <Left><Text style={styles.dividerText}>Mascota</Text></Left>
              </ListItem> 
              
              <ListItem noBorder>
                <Thumbnail square size={80} source={{uri: this.state.serviceInModal.thumbnail}}/>
                <Body>
                  <Text>{this.state.serviceInModal.petInfo.tempName}</Text>
                  <Text note>  
                    {this.state.serviceInModal.petInfo.dog&&'Perro '}
                    {this.state.serviceInModal.petInfo.cat&&'Gato '}
                    {this.state.serviceInModal.petInfo.hembra&&'hembra con '}
                    {this.state.serviceInModal.petInfo.macho&&'macho con '}
                    {this.state.serviceInModal.petInfo.edad} año(s) de edad.
                  </Text>
                </Body>
              </ListItem>
              
              <ListItem itemDivider>
                <Left><Text style={styles.dividerText}>Información de la solicitud</Text></Left>
              </ListItem>   
              
              <List>
                <ListItem avatar>
                  <Left>
                    <Thumbnail square size={60} source={images.record} />
                  </Left>
                  <Body>
                    <Text note>Tipo de solicitud</Text>
                    <Text>{(this.state.serviceInModal.type||'').toUpperCase()}</Text>                    
                  </Body>
                </ListItem>
                <ListItem avatar style={{marginTop: 5}}>
                  <Left>
                    <Thumbnail square size={80} source={images.vaccination} />
                  </Left>
                  <Body>
                    <Text note>Estado de la solicitud</Text>
                    <Text>{(this.state.serviceInModal.status||'').toUpperCase()}</Text>
                  </Body>
                </ListItem>
                {
                  this.state.serviceInModal.dateIni&&
                  <ListItem avatar style={{marginTop: 5}}>
                    <Left>
                      <Thumbnail square size={80} source={images.calendar} />
                    </Left>
                    <Body>
                      <Text note>Fecha de inicio y fin</Text>
                      <Text>
                        {this.state.serviceInModal.dateIni&&('Inicia el '+this.state.serviceInModal.dateIni+' ')}
                        {this.state.serviceInModal.dateFin&&('y termina el '+this.state.serviceInModal.dateFin)}
                      </Text>
                    </Body>
                  </ListItem>                
                }	

              </List>

              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <Text>{this.state.serviceInModal.dateIni&&('Inicia :'+this.state.serviceInModal.dateIni)}</Text>
                <Text>{this.state.serviceInModal.dateFin&&('Fin :'+this.state.serviceInModal.dateFin)}</Text>
              </View>

              {
                this.props.currentUser.uid===this.state.serviceInModal.founId && this.props.currentUser.type==='fundation' &&(
                  this.state.serviceInModal.status === 'pendiente' ? (
                    <View style={{flexDirection:'row',justifyContent:'space-around', marginBottom:10}}>
                      <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'rechazado')} rounded info>
                        <Text>Rechazar</Text>
                      </Button>
                      <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'aprobado')} rounded info>
                        <Text>Aceptar</Text>
                      </Button>
                    </View>
                  ):(
                    <View style={{flexDirection:'row',justifyContent:'space-around', marginBottom:10}}>
                      <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'progreso')} rounded info>
                        <Text>En progreso</Text>
                      </Button>
                      <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'finalizado')} rounded info>
                        <Text>Finalizado</Text>
                      </Button>
                    </View>
                  )
                )

              }
  
            </View>
          </Modal>}
          <List>
            {
              services?(
                Object.keys(services).map((i)=>{
                  return (services[i].status != 'rechazado' && services[i].status != 'finalizado') && (
                      <ListItem key={i} onPress={()=>this._detailService(services[i])}>
                        <Thumbnail rounded size={80} source={{ uri: services[i].thumbnail }} />
                        <Body>
                          <Text>{services[i].petInfo.tempName}</Text>
                          <Text note>{services[i].type}</Text>
                        </Body>
                        <Text>{services[i].status}</Text>
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
  },
  dividerText: {
		fontWeight: 'bold',
		color: '#2a2a2a'
	} 
});