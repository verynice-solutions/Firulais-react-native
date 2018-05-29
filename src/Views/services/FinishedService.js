import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Textarea, Toast, Left } from 'native-base';
import Ripple from 'react-native-material-ripple'
import StarRating from 'react-native-star-rating';
import serviceActions from '../../actions/serviceActions'
import images from '../../../assets/images'
import Ionicons from '@expo/vector-icons/Ionicons';

class FinishedService extends Component {
	constructor(props) {
		super(props);
		this.state = {
      starSelected: null,
      ratingDesc: '',
      serviceInModal: null,
      serviceId: this.props.navigation.state.params.serviceKey, 
      fetching:false,
    }
  }
  
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    let titleTop = 'Servicio'
		return{
			title: titleTop
    }
  }
  componentDidMount(){
    this._fetchService()
  }
  _fetchService = ()=>{
    this.setState({fetching: true})
    serviceActions.fetchAService(this.state.serviceId).then( (val) =>{
      // console.log('serviceInmodal',val)
      this.setState({serviceInModal: val, starSelected: val.rating,
        ratingDesc: val.ratingMsg ,fetching:false})
    }).catch((err)=>{
      Alert.alert('Error:','Problemas con la Conexión, lo sentimos.')
      this.props.navigation.goBack()
    })
  }
  _onStarRatingPress(rating) {
    //Set Rating
    this.setState({starSelected: rating})
  }
  _goToUserProfile = ()=>{
    this.props.navigation.navigate(
      'UserProfile', { userID: this.state.serviceInModal.userId })
  }
  _goToFundProfile = ()=>{
    this.props.navigation.navigate(
      'FoundationProfile', {foundationID: this.state.serviceInModal.founId })
  }
  _goToPetProfile = ()=>{
    this.props.navigation.navigate(
      'PetProfile', {petId: this.state.serviceInModal.petId })
  }
  _rateVolunteer() {
    if(this.state.starSelected && this.state.ratingDesc){
      serviceActions.setRating(this.state.serviceId, this.state.starSelected, this.state.ratingDesc)
      this._fetchService()
      this.props.navigation.goBack()
    }else{
      // Toast.show({
      //   text:'Recuerda llenar todos los campos \u2665',
      //   buttonText:'Ok',
      //   duration: 3000,
      //   type:'warning'
      // })
    }
  }
	render() {
    let serviceInModal = this.state.serviceInModal
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else if(serviceInModal){
      return (
        <ScrollView>
          
          {
            this.props.currentUser.type==='user' ? (
              <View style={{flex:1, flexDirection:'column',justifyContent:'space-around'}}>
                <ListItem itemDivider>
                  <Left><Text style={styles.dividerText}>Calificación del servicio</Text></Left>
                </ListItem>  
                {serviceInModal.ratingMsg?<ListItem avatar>
                  <Left>
                    <Thumbnail square source={images.chat_bubbles} />
                  </Left>
                  <Body>
                    <Text>Comentario</Text>
                    <Text numberOfLines={3} note style={{marginVertical:10}}>
                      {serviceInModal.ratingMsg}
                    </Text>
                  </Body>
                  <Right>
                    {serviceInModal.rating&&<Text>
                      {serviceInModal.rating} <Ionicons name="md-star" size={(20)} color="rgb(75, 75, 73)"/> 
                    </Text>}
                  </Right> 
                </ListItem>:<ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={images.wonder_kitty} />
                  </Left>
                  <Body>
                    <Text>Comentario</Text>
                    <Text numberOfLines={3} note style={{marginVertical:10}}>
                      Todavía no tienes calificación de este servicio.
                    </Text>
                  </Body>
                </ListItem>}
              </View>
            ):( 
              <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':null} style={{flex:1, flexDirection:'column', justifyContent:'center'}}>
                {serviceInModal.status==='rechazado'?<ListItem itemDivider>
                  <Left><Text style={styles.dividerText}>¿Por qué has rechazado el servicio de {serviceInModal.userInfo.givenName}?</Text></Left>
                </ListItem>
                :<ListItem itemDivider>
                  <Left><Text style={styles.dividerText}>¿Cómo ha sido el servicio de {serviceInModal.userInfo.givenName}?</Text></Left>
                </ListItem>
                } 

                {serviceInModal.status!=='rechazado'&&<View style={{padding: 10, marginHorizontal:50, marginTop:10}}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    fullStarColor={'purple'}
                    rating={this.state.starSelected}
                    selectedStar={(rating) => this._onStarRatingPress(rating)}/>  
                </View>}

                <View style={{paddingBottom: 10, marginHorizontal:20}}>
                  <Textarea bordered placeholder='Un mensaje para el voluntario...'
                    rowSpan={5}
                    autoCorrect={true}
                    value={this.state.ratingDesc}
                    onChangeText={(text)=> this.setState({ratingDesc: text})} />
                </View>

                <View style={{marginBottom:15}}/>
                <View style={{flexDirection:'row',justifyContent:'space-around'}}><Button onPress={()=>this._rateVolunteer()} block info>
                  <Text>  Calificar  </Text>
                </Button></View>
                <View style={{marginBottom:15}}/>
              </KeyboardAvoidingView>
            )
          }
          <View>
            <ListItem itemDivider>
              <Left><Text style={styles.dividerText}>Información del voluntario</Text></Left>
            </ListItem>               
          </View>
          <Ripple onPress={()=>this._goToUserProfile()}>
            <ListItem noBorder avatar >
              <Left>
                <Thumbnail size={40} source={{uri: serviceInModal.userInfo.photoUrl}} />
              </Left>
              <Body>
                <Text>{serviceInModal.userInfo.givenName}</Text>
                <Text note>{serviceInModal.userInfo.email}</Text>
                <Text note>{serviceInModal.phone}</Text>
              </Body>
            </ListItem>
          </Ripple>
  
          <View>
            <ListItem itemDivider>
              <Left><Text style={styles.dividerText}>Información 
              de la fundación</Text></Left>
            </ListItem>               
          </View>
          <Ripple onPress={()=>this._goToFundProfile()}>
            <ListItem noBorder avatar >
              <Left>
                <Thumbnail size={40} source={{uri: serviceInModal.fundInfo.photoUrl}} />
              </Left>
              <Body>
                <Text>{serviceInModal.fundInfo.givenName}</Text>
                <Text note>{serviceInModal.fundInfo.email}</Text>
              </Body>
            </ListItem>
          </Ripple>
  
          <ListItem itemDivider>
            <Left><Text style={styles.dividerText}>Mascota</Text></Left>
          </ListItem> 
          <Ripple onPress={()=>this._goToPetProfile()}>
            <ListItem noBorder>
              <Thumbnail square size={80} source={{uri: serviceInModal.thumbnail}}/>
              <Body>
                <Text>{serviceInModal.petInfo.tempName}</Text>
                <Text note numberOfLines={2}>  
                  {this.state.serviceInModal.petInfo.personalidad} 
                </Text>
              </Body>
            </ListItem>
          </Ripple>
  
          <ListItem itemDivider>
            <Left><Text style={styles.dividerText}>Información de la solicitud</Text></Left>
          </ListItem>  
          <ListItem avatar>
            <Left>
              <Thumbnail square size={60} source={images.record} />
            </Left>
            <Body>
              <Text note>Tipo de solicitud</Text>
              <Text>{(serviceInModal.type||'').toUpperCase()}</Text>                    
            </Body>
          </ListItem>
          <ListItem avatar style={{marginTop: 5}}>
            <Left>
              <Thumbnail square size={80} source={images.vaccination} />
            </Left>
            <Body>
              <Text note>Estado de la solicitud</Text>
              <Text>{(serviceInModal.status||'').toUpperCase()}</Text>
            </Body>
          </ListItem>
          {
            serviceInModal.dateIni&&
            <ListItem avatar style={{marginTop: 5}}>
              <Left>
                <Thumbnail square size={80} source={images.calendar} />
              </Left>
              <Body>
                <Text note>Fecha de inicio y fin</Text>
                <Text>
                  {serviceInModal.dateIni&&('Inicia el '+serviceInModal.dateIni+' ')}
                  {serviceInModal.dateFin&&('y termina el '+serviceInModal.dateFin)}
                </Text>
              </Body>
            </ListItem>                
          }
  

    
        </ScrollView>
      )
    }else{
      return(null)
    }
	}
}
function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(FinishedService)
const styles = StyleSheet.create({
  ModalContainer:{
    flex: 1,
    flexDirection:'column', 
    backgroundColor:'white',
    justifyContent:'center'
  }
});

