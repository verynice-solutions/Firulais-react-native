import React, { Component } from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Container, Content, List, ListItem, Thumbnail,
  Text, Body, Button, Item, Label, Input, Toast, Picker } from 'native-base'
import {Ionicons} from '@expo/vector-icons'
import DatePicker from 'react-native-datepicker'
import serviceActions from '../../actions/serviceActions'
import {_getNowDateISO, _getNextYear} from '../../utils/random_functions'
import {addDays} from '../../utils/random_functions'

var esLocale = require('moment/locale/es-us'); 
moment.updateLocale('es-us', esLocale);

class CreateService extends Component {
	constructor(props) {
    super(props)
    this.state = {
      selectedView: 1,
      dateIni: null,
      infoObject: this.props.navigation.getParam('toCreate'),
      carePhone: null,
      adoptPhone: null,
      tiempoCuidado: this.props.navigation.getParam('toCreate').petObj.tiempoMinCuidado,
      tiempoCuidadoRango: this.props.navigation.getParam('toCreate').petObj.tiempoMinCuidadoRango

    }
    this.toggleAdopt = this.toggleAdopt.bind(this)
    this.toggleCare = this.toggleCare.bind(this)
    // this.createService = this.createService.bind(this)
  }
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Ofrecer Servicio'
    }
  }
  
  componentDidMount() {
    let params = this.props.navigation.getParam('toCreate')
    if(this.props.currentUser.user){
      if(this.props.currentUser.user.profile){
        if(this.props.currentUser.user.profile.phone){
          this.setState({
            carePhone: this.props.currentUser.user.profile.phone||null,
            adoptPhone: this.props.currentUser.user.profile.phone||null,
          })
        }
      }
    }
    if(params.petObj.tiempoMinCuidadoRango == 'dias'){
      this.setState({tiempoCuidadoRango:'days'})
    }
    if(params.petObj.tiempoMinCuidadoRango == 'meses'){
      this.setState({tiempoCuidadoRango:'months'})
    }
    if(params.petObj.tiempoMinCuidadoRango == 'años'){
      this.setState({tiempoCuidadoRango:'years'})
    }
  }
  
  toggleAdopt() {
    this.setState({selectedView: 0})
  }

  toggleCare() {
    this.setState({selectedView: 1})
  }

	newService(object,type){
    let iniDate = this.state.dateIni
    let finDate = moment(iniDate).add(this.state.tiempoCuidado,this.state.tiempoCuidadoRango).format('YYYY-MM-DD')
    let rangoMin = null
  
    if(this.state.infoObject.petObj.tiempoMinCuidadoRango == 'dias'){
      rangoMin= 'days'
    }
    if(this.state.infoObject.tiempoMinCuidadoRango == 'meses'){
      rangoMin= 'months'
    }
    if(this.state.infoObject.tiempoMinCuidadoRango == 'años'){
      rangoMin= 'years'
    }

    let minimaDate = moment(iniDate).add(
      this.state.infoObject.petObj.tiempoMinCuidado,
      rangoMin
    ).subtract(1,'day')
    
    // console.log('iniDate: ',iniDate)
    // console.log('finDate: ', finDate) 
    // console.log('minimaDate: ', minimaDate) 
    let validDate = false
    if(moment(finDate).isAfter(minimaDate)){
      // console.log(' IS AFTER TRUE')
      validDate = true
    }
    let info_user = {}
    if(this.props.currentUser.user){
      info_user = this.props.currentUser.user
    }
    if(type=='cuidado'){
      if( iniDate && finDate && this.state.carePhone && validDate){
        serviceActions.createService(
          object.petObj.pet_fire_key, 
          object.fid, 
          object.uid, 
          object.petObj,
          type,
          iniDate,
          finDate,
          this.state.carePhone,
          info_user||null,
          object.fundObj
        )
        this.props.navigation.goBack()
      }else{
        if(!iniDate || !finDate || !validDate){
          Toast.show({
            text:'Por favor ingresa un tiempo de cuidado o fecha válidos \u2661',
            buttonText:'Ok',
            duration: 4000,
            type:'warning'
          })
        }else{
          Toast.show({
            text:'Recuerda llenar todos los campos \u2661',
            buttonText:'Ok',
            duration: 4000,
            type:'warning'
          })
        }
      }
    }else{
      if(this.state.adoptPhone){
        serviceActions.createService(
          object.petObj.pet_fire_key, 
          object.fid, 
          object.uid, 
          object.petObj,
          type,
          null,null,
          this.state.adoptPhone,
          info_user||null,
          object.fundObj
        )
        this.props.navigation.goBack()
      }else{
        Toast.show({
          text:'Recuerda llenar todos los campos \u2661',
          buttonText:'Ok',
          duration: 4000,
          type:'warning'
        })
      }

    }
  }
  
  renderDatePickerIni = () => {
    return <View style={{alignItems:'center'}}><DatePicker
      style={{width: 200}}
      date = {this.state.dateIni}
      mode="date"
      placeholder="Fecha"
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

  renderCare = ()=>{
    let object = this.state.infoObject
    // console.log('infoObject',object)
    let iniDate = this.state.dateIni
    let tiempoCuidadoMin = object.petObj.tiempoMinCuidado
    let tiempoCuidadoRangoMin = object.petObj.tiempoMinCuidadoRango
    let momentIni = moment(iniDate).format('dddd DD MMMM YYYY')
    let momentFin = moment(iniDate).add(this.state.tiempoCuidado,this.state.tiempoCuidadoRango)
    if(iniDate){
      momentFin = momentFin.format('dddd D MMMM YYYY')
    }
    return(
      <View style={styles.subcontainer}>
        <View style={styles.pickerContainer}>
          <ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
            <Text style={{fontWeight:'bold'}}>TIEMPO DE CUIDADO</Text>
          </ListItem>  
          <View style={{padding: 10}}>
            <Text style={{textAlign:'center'}}>¿Por cuánto tiempo deseas cuidar a {object.petObj.tempName}?</Text>
            <Text style={{fontStyle:'italic',textAlign:'center'}}> {object.fundObj.givenName} - "mínimo {object.petObj.tiempoMinCuidado} {object.petObj.tiempoMinCuidadoRango}"</Text>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <Item fixedLabel style={{flex: 0.2}}>
                <Input placeholder='nº' keyboardType='numeric'
                value={this.state.tiempoCuidado}
                onChangeText={(text)=> { this.setState({tiempoCuidado: text}) }} />
              </Item>
              <Picker
                mode="dropdown"
                placeholder="Rango de tiempo"
                iosHeader="Rango de tiempo"
                iosIcon={<Ionicons name="ios-arrow-down-outline" />}
                headerBackButtonText="Atrás"
                style={{ width: undefined, flex: 0.8 }}
                selectedValue={this.state.tiempoCuidadoRango}
                onValueChange={(value)=>{
                  this.setState({tiempoCuidadoRango: value
                })}}>
                <Picker.Item label="Dias" value="days" />
                <Picker.Item label="Meses" value="months" />
                <Picker.Item label="Años" value="years" />
              </Picker>          
          </View> 

          </View>
        </View>
        <ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
          <Text style={{fontWeight:'bold'}}>FECHA DE INICIO</Text>
        </ListItem> 
        <View style={{padding: 10}}>
          <Text style={{textAlign:'center'}}>¿Que día iniciará el cuidado?</Text>
          <View style={{padding: 10, alignContent:'center'}}>
            {this.renderDatePickerIni()}
          </View> 
          
          {iniDate&&
            <Text style={{fontStyle:'italic',textAlign:'center'}}>
              Inicia el {momentIni}
            </Text>
          }
          {iniDate&&
            <Text style={{fontStyle:'italic',textAlign:'center'}}>
              Finaliza el {momentFin}
            </Text>
          }        
        </View> 

        <ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
          <Text style={{fontWeight:'bold'}}>TELÉFONO DE CONTACTO</Text>
        </ListItem> 
        <View style={{padding: 10}}>
          <Item>
            <Input keyboardType='numeric' placeholder='Teléfono' 
              value={this.state.carePhone} 
              onChangeText={(text)=> this.setState({carePhone: text})}/>
          </Item>
          <Button style={{margin: 10}} success block onPress={()=>this.newService(object,'cuidado')}>
            <Text>Programar cuidado</Text>
          </Button>          
        </View>
      </View>

    )
  }

  renderAdopt = () =>{
    let object = this.state.infoObject
    let iniDate = this.state.dateIni
    let momentIni = moment(iniDate).format('dddd DD MMMM YYYY')
    return(
      <View style={styles.subcontainer}>
        <ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
          <Text style={{fontWeight:'bold'}}>TELÉFONO DE CONTACTO</Text>
        </ListItem>
        <View style={{padding: 10}}>
          <Text style={{textAlign:'center'}}>Deja tu número de contacto para que la fundación pueda contactarte y conversar requisitos para la adopción.</Text>
          <Item>
            <Input keyboardType='numeric' placeholder='Teléfono'  
            value={this.state.adoptPhone} onChangeText={(text)=> this.setState({adoptPhone: text})} />
          </Item>
        </View>
        <View style={{margin: 10}}>
          <Button block success onPress={()=>this.registerAdoption(object)}>
            <Text>Registrar adopción</Text>
          </Button>
        </View>
      </View>
    )
  }
  registerAdoption = (object) => {

    if(this.state.adoptPhone){
      Alert.alert(
        `Confirmar adopción`,
        `Estoy segur@ de que quiero adoptar a ${object.petObj.tempName} \u2661`,
        [
          {text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'SI', onPress: () => this.newService(object,'adoptar')},
        ],
        { cancelable: false }
      )
    } else {
      Toast.show({
        text:'Por favor ingresa tu teléfono de contacto \u2661',
        buttonText:'Ok',
        duration: 4000,
        type:'warning'
      })
    }


  }
  renderBtns = () => {
    if(this.state.selectedView === 0){
      return <View style={{flex:1, paddingVertical:10, flexDirection: 'row', justifyContent:'space-around', backgroundColor:'#ffffff'}}>
        <Button onPress={this.toggleCare} primary bordered style={{flex:0.47, justifyContent:'center'}}>
            <Text>Cuidar</Text>
        </Button>
        <Button onPress={this.toggleAdopt} primary style={{flex:0.47, justifyContent:'center'}}>
            <Text>Adoptar</Text>
        </Button>
      </View>
    }else{
      return <View style={{flex:1, paddingVertical:10, flexDirection: 'row', justifyContent:'space-around', backgroundColor:'#ffffff'}}>
        <Button onPress={this.toggleCare} primary style={{flex:0.47, justifyContent:'center'}}>
            <Text>Cuidar</Text>
        </Button>
        <Button onPress={this.toggleAdopt} primary bordered style={{flex:0.47, justifyContent:'center'}}>
            <Text>Adoptar</Text>
        </Button>
      </View>
    }
  }
	render() {
    
    return (
      <Container> 
        <Content>
          {this.renderBtns()}
          {
            this.state.selectedView === 0 ? (
              this.renderAdopt()
            ):(
              this.renderCare()
            )
          }
        </Content>
      </Container>
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
   justifyContent:'space-around'
  },
  pickerContainer:{
    flexDirection:'column',

  },
  textHeaders:{
    fontWeight: 'bold'
  }
});