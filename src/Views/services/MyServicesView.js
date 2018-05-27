import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator,ScrollView, Image } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Left, Icon } from 'native-base';
import Modal from 'react-native-modal'
import Ripple from 'react-native-material-ripple';
import serviceActions from '../../actions/serviceActions'
import images from '../../../assets/images'
import Ionicons from '@expo/vector-icons/Ionicons';

class MyServicesView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allServices: [],
      isDetailVisible: false,
      serviceInModal: null,
      fetching:false,
    }
    this._detailService = this._detailService.bind(this)
    this._reviewService = this._reviewService.bind(this)
  }

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    let titleTop = 'Solicitudes'
		return{
      title: titleTop,
      tabBarLabel: 'Activas'
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
  _goToUserProfile = ()=>{
    this.setState({ isDetailVisible: false })
    setTimeout(() => {
      this.props.navigation.navigate(
        'UserProfile', { userID: this.state.serviceInModal.userId })
    }, 300);
  }
  _goToFundProfile = ()=>{
    this.setState({ isDetailVisible: false })
    setTimeout(() => {
      this.props.navigation.navigate(
        'FoundationProfile', {foundationID: this.state.serviceInModal.founId })
    }, 300);
  }
	render() {
    let services = this.state.allServices
    let user = this.props.currentUser
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else{
      // console.log('serviceINMODAL',this.state.serviceInModal)
      // console.log('SERVICES', services)
      // console.log('user', user)
      return (
        <View style={{flex:1}}> 
          {this.state.serviceInModal&&
          <Modal isVisible={this.state.isDetailVisible}
          onBackButtonPress={()=>this._toggleModal()}
          onBackdropPress={()=>this._toggleModal()}>

            <View>
              <ListItem itemDivider>
                <Left><Text style={styles.dividerText}>Información 
                {user.type==='user'?' de la fundación':' del voluntario'}</Text></Left>
                <Right>
                  <TouchableOpacity style={{padding:2,paddingLeft:25}} onPress={()=>this._toggleModal()}>
                    <Ionicons name='md-close' size={20}/>
                  </TouchableOpacity>
                </Right>
              </ListItem>               
            </View>
            <View style={styles.ModalContainer}>
              {user.type==='fundation'?
              <Ripple onPress={()=>this._goToUserProfile()}>
                <ListItem noBorder>
                  <Thumbnail rounded size={40} source={{uri: this.state.serviceInModal.userInfo.photoUrl}} />
                  <Body>
                    <Text>{this.state.serviceInModal.userInfo.givenName}</Text>
                    <Text note>{this.state.serviceInModal.userInfo.email}</Text>
                    {(this.state.serviceInModal.status !== 'pendiente')&&
                      <Text note>{this.state.serviceInModal.phone}</Text>}
                  </Body>
                </ListItem>
              </Ripple>
              :
              <Ripple onPress={()=>this._goToFundProfile()}>
                <ListItem noBorder>   
                  <Thumbnail rounded size={40} source={{uri: this.state.serviceInModal.fundInfo.photoUrl}} /> 
                  <Body>
                    <Text>{this.state.serviceInModal.fundInfo.givenName}</Text>
                    <Text note>{this.state.serviceInModal.fundInfo.email}</Text>
                  </Body>
                </ListItem>
              </Ripple>
              }

              <ListItem itemDivider>
                <Left><Text style={styles.dividerText}>Mascota</Text></Left>
              </ListItem> 
              
              <ListItem noBorder>
                <Thumbnail rounded size={80} source={{uri: this.state.serviceInModal.thumbnail}}/>
                <Body>
                  <Text>{this.state.serviceInModal.petInfo.tempName}</Text>
                  <Text note>  
                    {this.state.serviceInModal.petInfo.dog&&'Perro '}
                    {this.state.serviceInModal.petInfo.cat&&'Gato '}
                    {this.state.serviceInModal.petInfo.hembra&&'hembra con '}
                    {this.state.serviceInModal.petInfo.macho&&'macho con '}
                    {this.state.serviceInModal.petInfo.edad} de edad.
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


              <View style={{justifyContent:'flex-end', flexDirection: 'column', flex:1}}>
              {
                user.uid===this.state.serviceInModal.founId && user.type==='fundation' &&(
                  this.state.serviceInModal.status === 'pendiente' ? (
                    <View style={{flexDirection:'row',justifyContent:'space-around', margin:10}}>
                      <Button style={{flex: 0.47}} danger onPress={()=>this._reviewService(this.state.serviceInModal.servId,'rechazado')} block>
                        <Text>Rechazar</Text>
                      </Button>
                      <Button style={{flex: 0.47}} success onPress={()=>this._reviewService(this.state.serviceInModal.servId,'aprobado')} block>
                        <Text>Aceptar</Text>
                      </Button>
                    </View>
                  ):(
                    this.state.serviceInModal.status == 'progreso' ? (
                      <View style={{flexDirection:'row',justifyContent:'space-around', margin:10}}>
                        <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'finalizado')} block style={{flex: 1}} info>
                          <Text>Finalizar</Text>
                        </Button>
                      </View>
                    ):(
                      <View style={{flexDirection:'row',justifyContent:'space-around', marginBottom:10,marginTop:10}}>
                        <Button onPress={()=>this._reviewService(this.state.serviceInModal.servId,'progreso')} block style={{flex: 0.9}} info>
                          <Text>Iniciar</Text>
                        </Button>
                      </View>
                    )
                  )
                )

              }
              </View>
            </View>
          </Modal>}
          <List>
            {
              services?(
                Object.keys(services).map((i)=>{
                  return (services[i].status != 'rechazado' && services[i].status != 'finalizado') && (
                      <Ripple key={i} onPress={()=>this._detailService(services[i])} >
                        <ListItem>
                          <Thumbnail rounded size={80} source={{ uri: services[i].thumbnail }} />
                          <Body>
                            <Text>{services[i].petInfo.tempName}</Text>
                            <Text note>{services[i].type}</Text>
                          </Body>
                          <Text>{services[i].status}</Text>
                        </ListItem>
                      </Ripple>
                    )
                  
                })
              ):(
                <View style={{paddingTop:100,justifyContent:'center',alignItems:'center'}}>
                  <Image source={images.thinking_kitty} resizeMode= 'contain' 
                    style={{height: 180, width: 180}}/>
                  <Text style={{fontStyle:'italic',fontFamily:'Roboto-Bold',fontSize:18,marginTop:18}}>Aún no
                  {user.type==='fundation'?' te han enviado solicitudes.':' te has ofrecido como voluntario?'} </Text>
                </View>
              )
            }
          </List>
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
export default connect(mapStateToProps)(MyServicesView)

const styles = StyleSheet.create({
  ModalContainer:{
    flex:0.9,
    flexDirection:'column', 
    backgroundColor:'white',
  },
  dividerText: {
		fontWeight: 'bold',
		color: '#2a2a2a'
	} 
});