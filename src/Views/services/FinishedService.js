import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Textarea, Toast, Left } from 'native-base';
import StarRating from 'react-native-star-rating';
import serviceActions from '../../actions/serviceActions'
import images from '../../../assets/images'

class FinishedService extends Component {
	constructor(props) {
		super(props);
		this.state = {
      starSelected: null,
      ratingDesc: ''
    }
  }
  
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    let titleTop = 'Servicio'
		return{
			title: titleTop
    }
  }

  _onStarRatingPress(rating) {
    //Set Rating
    this.setState({starSelected: rating})
  }

  _rateVolunteer() {
    if(this.state.starSelected && this.state.ratingDesc){
      serviceActions.setRating(this.props.navigation.state.params.serviceKey, this.state.starSelected, this.state.ratingDesc)
    }else{
      Toast.show({
        text:'Recuerda llenar todos los campos \u2661',
        buttonText:'Ok',
        duration: 4000,
        type:'warning'
      })
    }
  }
	render() {
    let serviceInModal = this.props.navigation.state.params.serviceInModal
		return (
			<ScrollView>
        <View>
          <ListItem itemDivider>
            <Left><Text style={styles.dividerText}>Información del voluntario</Text></Left>
          </ListItem>               
        </View>
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
          <Thumbnail square size={80} source={{uri: serviceInModal.thumbnail}}/>
          <Body>
            <Text>{serviceInModal.petInfo.tempName}</Text>
            <Text note>  
              {serviceInModal.petInfo.dog&&'Perro '}
              {serviceInModal.petInfo.cat&&'Gato '}
              {serviceInModal.petInfo.hembra&&'hembra con '}
              {serviceInModal.petInfo.macho&&'macho con '}
              {serviceInModal.petInfo.edad} año(s) de edad.
            </Text>
          </Body>
        </ListItem>

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

        {
          serviceInModal.status === 'finalizado' && (
            this.props.currentUser.type==='user' ? (
              <View style={{flex:1, flexDirection:'column',justifyContent:'space-around'}}>
                <View style={{padding: 10, marginHorizontal:50, marginTop:10}}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    fullStarColor={'purple'}
                    rating={serviceInModal.rating ? serviceInModal.rating : 0}/>                
                </View>
                <Text style={{textAlign: 'center'}}>{serviceInModal.ratingMsg ? serviceInModal.ratingMsg : 'No hay calificación aún'}</Text>
                </View>
            ):( 
              <KeyboardAvoidingView behavior='padding' style={{flex:1, flexDirection:'column', justifyContent:'center'}}>
                <ListItem itemDivider>
                  <Left><Text style={styles.dividerText}>Da tu opinión...</Text></Left>
                </ListItem> 

                <View style={{padding: 10, marginHorizontal:50, marginTop:10}}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    fullStarColor={'purple'}
                    rating={this.state.starSelected}
                    selectedStar={(rating) => this._onStarRatingPress(rating)}/>  
                </View>
                <View style={{paddingBottom: 10, marginHorizontal:20}}>
                  <Textarea bordered placeholder='Un mensaje para el voluntario'
                    rowSpan={5}
                    autoCorrect={true}
                    value={this.state.ratingDesc}
                    onChangeText={(text)=> this.setState({ratingDesc: text})} />
                </View>


                <View style={{flexDirection:'row',justifyContent:'space-around'}}><Button onPress={()=>this._rateVolunteer()} rounded info>
                  <Text>  Calificar  </Text>
                </Button></View>
              </KeyboardAvoidingView>
            )
          )
          
        }
  
      </ScrollView>
		)
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

