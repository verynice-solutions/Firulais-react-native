import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Button,Item, Label, Input, Toast } from 'native-base';
import DatePicker from 'react-native-datepicker'
import serviceActions from '../../actions/serviceActions'
import {_getNowDateISO, _getNextYear} from '../../utils/random_functions'

class CreateService extends Component {
	constructor(props) {
    super(props)
    this.state = {
      selectedView: 1,
      dateIni: null,
      dateFin: null,
      infoObject: this.props.navigation.getParam('toCreate'),
      carePhone: null,
      adoptPhone: null

    }
    this.toggleAdopt = this.toggleAdopt.bind(this)
    this.toggleCare = this.toggleCare.bind(this)
    this.createService = this.createService.bind(this)
  }
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Ofrecer Servicio'
    }
  }
  
  componentDidMount() {
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
        <Item style={{width:'80%'}} stackedLabel>
          <Label> Teléfono </Label>
          <Input keyboardType='numeric' 
          value={this.state.adoptPhone} onChangeText={(text)=> this.setState({adoptPhone: text})} />
        </Item>
        <View>
          <Button rounded success onPress={()=>Alert.alert(
            `Adoptar a ${object.petObj.tempName}`,
            'Lo quiero for ever \u2661',
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

  createService(object,type) {
    serviceActions.fetchUserServices(this.props.currentUser.uid).then((val)=>{
      let validate = false
      if(val){
        Object.keys(val).map((item, index)=>{
          if(val[item].petId == object.petObj.pet_fire_key){
            if(val[item].status!='finalizado' && val[item].status!='rechazado'){
              validate = true
            }
          }
        })
      }
      if (validate){
        Toast.show({
          text:'Ya existe un servicio \u2661',
          buttonText:'Ok',
          duration: 4000,
          type:'warning'
        })
      }else{
        this.newService(object,type)
      }
    })
  }

	newService(object,type){
    let iniDate = new Date(this.state.dateIni)
    let finDate = new Date(this.state.dateFin)
    let validDate = true
    if(iniDate.getTime()>finDate.getTime()){
      validDate = false
    }

    let info_user = {}
    if(this.props.currentUser.user){
      info_user = this.props.currentUser.user
    }
    if(type=='cuidado'){
      if(this.state.dateIni && this.state.dateFin && this.state.carePhone){
        serviceActions.createService(
          object.petObj.pet_fire_key, 
          object.fid, 
          object.uid, 
          object.petObj,
          type,
          this.state.dateIni,
          this.state.dateFin,
          this.state.carePhone,
          info_user||null,
          object.fundObj
        )
        this.props.navigation.goBack()
      }else{
        if(!this.state.dateIni || !this.state.dateFin || !validDate){
          Toast.show({
            text:'Asigna una fecha válida \u2661',
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
          text:'Recuerda darnos tu teléfono \u2661',
          buttonText:'Ok',
          duration: 4000,
          type:'warning'
        })
      }

    }
  }
  
  renderCare = ()=>{
    let object = this.state.infoObject
    // console.log('infoObject',object)
    return(
      <View style={styles.subcontainer}>
        {this.renderDatePickerIni()}
        {this.renderDatePickerFin()}
        <Item style={{width:'80%'}} stackedLabel>
          <Label> Teléfono </Label>
          <Input keyboardType='numeric' 
          value={this.state.carePhone} onChangeText={(text)=> this.setState({carePhone: text})} />
        </Item>
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
      <View style={{ flex: 1, justifyContent:'center'}}> 
        
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