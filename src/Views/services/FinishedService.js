import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right, Button, Textarea, Toast } from 'native-base';
import StarRating from 'react-native-star-rating';
import serviceActions from '../../actions/serviceActions'

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
			<View style={styles.ModalContainer}>
            
              <View style={{margin: 10, flexDirection:'row',justifyContent:'space-around'}}>
                <Text>{(serviceInModal.type||'').toUpperCase()}</Text>
                <Text>{(serviceInModal.status||'').toUpperCase()}</Text>
              </View>
  
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <Thumbnail style={{marginHorizontal:5}} source={{uri: serviceInModal.thumbnail}}/>
                <View style={{flex:1, flexDirection:'column',justifyContent:'space-around'}}>
                  <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <Text>{serviceInModal.petInfo.tempName}</Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <Text>{serviceInModal.petInfo.dog&&'Dog'}</Text>
                    <Text>{serviceInModal.petInfo.cat&&'Cat'}</Text>
                    <Text>{serviceInModal.petInfo.hembra&&'Female'}</Text>
                    <Text>{serviceInModal.petInfo.macho&&'Male'}</Text>
                    <Text>{'edad: '+serviceInModal.petInfo.edad}</Text>
                  </View>
                </View>
              </View>
  
              <View style={{flex:1, flexDirection:'row',justifyContent:'space-around'}}>
                <Text>{serviceInModal.dateIni&&('Inicia :'+serviceInModal.dateIni)}</Text>
                <Text>{serviceInModal.dateFin&&('Fin :'+serviceInModal.dateFin)}</Text>
              </View>

              {
                serviceInModal.status === 'finalizado' && (
                  this.props.currentUser.type==='user' ? (
                    <View style={{flex:1, flexDirection:'column',justifyContent:'space-around'}}>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        fullStarColor={'purple'}
                        rating={serviceInModal.rating ? serviceInModal.rating : 0}
                      />
                      <Text style={{textAlign: 'center'}}>{serviceInModal.ratingMsg ? serviceInModal.ratingMsg : 'No hay calificación aún'}</Text>
                     </View>
                  ):( 
                    <View style={{flex:1, margin:10, padding: 5, flexDirection:'column',justifyContent:'center'}}>
                      <Text style={{textAlign: 'center'}}> Da tu opinion! </Text>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        fullStarColor={'purple'}
                        rating={this.state.starSelected}
                        selectedStar={(rating) => this._onStarRatingPress(rating)}
                      />
                      <Textarea bordered placeholder='Un mensaje para el voluntario'
                        rowSpan={5}
                        autoCorrect={true}
                        value={this.state.ratingDesc}
                        onChangeText={(text)=> this.setState({ratingDesc: text})} 
                      />
                     <View style={{flexDirection:'row',justifyContent:'space-around'}}><Button onPress={()=>this._rateVolunteer()} rounded info>
                        <Text>Calificar</Text>
                      </Button></View>
                    </View>
                  )
                )
                
              }
  
            </View>
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

