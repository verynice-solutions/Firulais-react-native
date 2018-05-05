import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native'
import {connect} from 'react-redux'
import firebase from '../../../firebase/firebaseSingleton'
import { ImagePicker } from 'expo'
//Style
import {Container,Content,Body,Button,Text,Icon,Form,Textarea,CheckBox,List,ListItem} from 'native-base'
import { scale } from '../../../lib/responsive';
import {randomPuppers} from '../../../utils/random_functions'

class AddPet extends Component {
	constructor(props) {
    super(props);
    this.state={
      cameraGranted:false,
      description:'',
      dog:false, cat:false,
      pequeño:false, mediano:false, grande:false,
      macho:false, hembra:false,
      edad:'',
      cuidado:'',
      amigableConPersonas: true,
      amigableConOtrosPets: true,
    }
		this._añadirMascota=this._añadirMascota.bind(this)
  }
  
  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Añadir mascota',
			headerRight: (
			<Button transparent onPress={params.addPet}>
				<Text primary>save</Text>
			</Button>)
    }
  }
  getCameraPermission= async ()=>{
    try{
      const { Permissions } = Expo;
      const response = await Permissions.getAsync('camera');
      console.log('RESPONSE PERMISSION:',response)
      if (response.status !== 'granted') {
        if (response.status === 'denied' || response.status === 'undetermined') {
          Alert.alert('Please enable camera access from your device settings.');
        }else{
          const { status } = await Permissions.askAsync('camera');
          if(status==='granted') this.setState({cameraGranted:true})
        }
      }else{ this.setState({cameraGranted:true})}
    }catch(error){
      Alert.alert(error.message)
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({ addPet: this._añadirMascota })
	}
  _añadirMascota(){
    firebase.database().ref().child('pets').push({
      ...this.state
    }).then(() => {
      Alert.alert('Mascota añadida')
    })
	}
  _onCamera = async () => {
    // let permi = await this.getCameraPermission()
    let result = await ImagePicker.launchCameraAsync()
    // console.log('RESULT ',result)
    if(!result.cancelled){
      this._uploadImage(result.uri,'test1')
        .then(() => {
          Alert.alert('La imagen fue guardada')
        })
        .catch((error) => {
          Alert.alert(error)
        })
    }
  }
  _uploadImage = async (uri,petID) => {
    const response = await fetch(uri)
    const blop = await response.blob()

    var ref = firebase.storage().ref().child('images/pets/'+ petID)
    return ref.put(blop)
  }
	render() {
		let {user} = this.props.currentUser
		return (
			<Container>
				<Content padder>
					<View style={{marginTop:20}}/>
          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
						<Button bordered onPress={this._onGalery}>
							<Text primary>Galería +</Text>
						</Button>
            <Button bordered onPress={this._onCamera}>
							<Text primary>Cámara +</Text>
						</Button>
					</View>
            <View style={{marginTop:20}}/>
            <Text> Cómo es? </Text>
            <Textarea bordered placeholder='He is the best dog EVER...'
            autoCorrect={true}
            value={this.state.description}
            onChangeText={(text)=> this.setState({description: text})} 
            />
            <View style={{marginTop:10}}/>
            <Text> Tipo </Text>
              <ListItem>
                <CheckBox onPress={()=>{this.setState({dog:!this.state.dog ,cat:false})}} 
                  checked={this.state.dog}/>
                <Text style={{paddingLeft:15}}>Perro</Text>
              </ListItem>
              <ListItem>
                <CheckBox onPress={()=>{this.setState({cat:!this.state.cat ,dog:false})}} 
                  checked={this.state.cat} />
                <Text style={{paddingLeft:15}}>Gato</Text>
              </ListItem>
              <View style={{marginTop:10}}/>
            <Text> Tamaño </Text>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({pequeño:!this.state.pequeño ,mediano:false, grande:false})}} 
                checked={this.state.pequeño} color='green'/>
              <Text style={{paddingLeft:15}}>Pequeño</Text>
            </ListItem>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({mediano:!this.state.mediano ,pequeño:false, grande:false})}} 
                checked={this.state.mediano} color='green'/>
              <Text style={{paddingLeft:15}}>Mediano</Text>
            </ListItem>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({grande:!this.state.grande ,mediano:false, pequeño:false})}} 
                checked={this.state.grande} color='green'/>
              <Text style={{paddingLeft:15}}>Grande</Text>
            </ListItem>
            <View style={{marginTop:10}}/>
            <Text> Que edad tiene? </Text>
            <Textarea bordered placeholder='2 años y 3 cuartos...'
            autoCorrect={false}
            value={this.state.edad}
            onChangeText={(text)=> this.setState({edad: text})} 
            />
            <View style={{marginTop:10}}/>
            <Text> Género </Text>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({hembra:!this.state.hembra , macho:false })}} 
                checked={this.state.hembra} color='purple'/>
              <Text style={{paddingLeft:15}}>Hembra</Text>
            </ListItem>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({macho:!this.state.macho ,hembra:false })}} 
                checked={this.state.macho} color='purple' />
              <Text style={{paddingLeft:15}}>Macho</Text>
            </ListItem>
            <View style={{marginBottom:40}}/>
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
export default connect(mapStateToProps)(AddPet)

const styles = StyleSheet.create({

});