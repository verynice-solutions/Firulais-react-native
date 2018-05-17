import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Button } from 'native-base';
import DatePicker from 'react-native-datepicker'
import userActions from '../../actions/usersActions'
import {_getNowDateISO, _getNextYear} from '../../utils/random_functions'

class CreateService extends Component {
	constructor(props) {
    super(props)
    this.state = {
      selectedView: 1,
      dateIni: null,
      dateFin: null,
      infoObject: this.props.navigation.getParam('toCreate'),

    }
    this.toggleAdopt = this.toggleAdopt.bind(this)
    this.toggleCare = this.toggleCare.bind(this)
    this.createService = this.createService.bind(this)
  }
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Pedir Servicio'
    }
  }
  
  componentDidMount() {

  }
  
  toggleAdopt() {
    this.setState({selectedView: 0})
  }

  toggleCare() {
    this.setState({selectedView: 1})
  }

  renderBtns = () => {
    if(this.state.selectedView === 0){
      return <View style={{flex:0, marginTop:10, flexDirection: 'row', justifyContent:'space-around'}}>
        <Button onPress={this.toggleCare} rounded light>
            <Text>Cuidar</Text>
        </Button>
        <Button onPress={this.toggleAdopt} rounded info>
            <Text>Adoptar</Text>
        </Button>
      </View>
    }else{
      return <View style={{flex:0, marginTop:10, flexDirection: 'row', justifyContent:'space-around'}}>
        <Button onPress={this.toggleCare} rounded info>
            <Text>Cuidar</Text>
        </Button>
        <Button onPress={this.toggleAdopt} rounded light>
            <Text>Adoptar</Text>
        </Button>
      </View>
    }
  }
  renderAdopt = () =>{
    let object = this.state.infoObject
    return(
      <View style={styles.subcontainer}>
        <Text> Adopt me, you pretty face :3 </Text>
        <View>
          <Button rounded success onPress={()=>Alert.alert(
            `Adoptar a ${object.petObj.tempName}`,
            'Lo quiero for ever <3',
            [
              {text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'SI', onPress: () => this.createService(object,'adoptar')},
            ],
            { cancelable: false }
          )}>
            <Text>Registrar adopción</Text>
          </Button>
        </View>
      </View>
    )
  }

	createService(object,type){
    if(type=='cuidado'){
      if(this.state.dateIni || this.state.dateFin){
        userActions.createService(
          object.petObj.pet_fire_key, 
          object.fid, 
          object.uid, 
          object.petObj,
          type,
          this.state.dateIni,
          this.state.dateFin
        )
        this.props.navigation.goBack()
      }else{
        Alert.alert('Fechas vacías ','Recuerda llenar todos los campos 📅',)
      }
    }else{
      userActions.createService(
        object.petObj.pet_fire_key, 
        object.fid, 
        object.uid, 
        object.petObj,
        type,
        null,null
      )
      this.props.navigation.goBack()
    }
  }
  
  renderCare = ()=>{
    let object = this.state.infoObject
    return(
      <View style={styles.subcontainer}>
        <Text> Or wanna take care of my ass :D </Text>
        {this.renderDatePickerIni()}
        {this.renderDatePickerFin()}
        <View>
          <Button rounded info onPress={()=>this.createService(object,'cuidado')}>
            <Text>Programar cuidado</Text>
          </Button>
        </View>
      </View>
    )
  }

  renderDatePickerIni = () => {
    return <View><DatePicker
      style={{width: 200}}
      date = {this.state.dateIni}
      mode="date"
      placeholder="Inicio cuidado"
      format="YYYY-MM-DD"
      minDate={_getNowDateISO()}
      maxDate={_getNextYear()}
      confirmBtnText="Confirmar"
      cancelBtnText="Cancelar"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 0 //36
        }
        // ... You can check the source to find the other keys.
      }}
      onDateChange={(date) => {this.setState({dateIni: date})}}
    /></View>
  }
  renderDatePickerFin = () => {
    return <View><DatePicker
      style={{width: 200}}
      date={this.state.dateFin}
      mode="date"
      placeholder="Fin cuidado"
      format="YYYY-MM-DD"
      minDate={_getNowDateISO()}
      maxDate={_getNextYear()}
      confirmBtnText="Confirmar"
      cancelBtnText="Cancelar"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          right: 0,
          top: 4,
          marginRight: 0
        },
        dateInput: {
          marginRight: 0 //36
        }
        // ... You can check the source to find the other keys.
      }}
      onDateChange={(date) => {this.setState({dateFin: date})}}
    /></View>
  }

	render() {
    
    return (
      <View style={{ flex: 0.6, justifyContent:'center'}}> 

        {this.renderBtns()}
        {
          this.state.selectedView === 0 ? (
            this.renderAdopt()
          ):(
            this.renderCare()
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
export default connect(mapStateToProps)(CreateService)

const styles = StyleSheet.create({
 subcontainer: {
   flex:1, 
   padding:20, 
   margin: 10, 
   alignItems:'center', 
   justifyContent:'space-around'
  }
});