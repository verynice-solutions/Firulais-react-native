import _ from 'lodash'
import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
import firebase from '../../../firebase/firebaseSingleton'
import { ImagePicker } from 'expo'
//Style
import {Container,Content,Body,Button,Text,Icon,Form,Textarea,CheckBox,List,ListItem} from 'native-base'
import { scale } from '../../../lib/responsive';
import {randomPuppers} from '../../../utils/random_functions'
import { FlatList } from 'react-native-gesture-handler';

class AddPet extends Component {
	constructor(props) {
    super(props);
    this.state={
      images:[],
      fetchingImages:false,
      description:'test',
      dog:true, cat:null,
      pequeño:true, mediano:null, grande:null,
      hembra:true, macho:null,
      edad:'2',
      amigableConPersonas: true,
      amigableConOtrosPets: true,
      pet_fire_key: firebase.database().ref().child('pets').push().key,
      blockButton: false
    }

    this._añadirMascota=this._añadirMascota.bind(this)
    this.renderImageItem=this.renderImageItem.bind(this)
  }
  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Añadir mascota',
			headerRight: (
			<Button transparent onPress={params.addPet}>
				<Text primary>GUARDAR</Text>
			</Button>)
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({ addPet: this._añadirMascota })
	}
  _añadirMascota(){
    let valuesToSend = this._setValuesMascota(this.state)
    let petID = this.state.pet_fire_key
    if(valuesToSend===false) {
      Alert.alert('Recuerda llenar todos los campos <3')
    }else {
      this.setState({blockButton: true})
      this._upLoadPhotos()
        .then(() => {
        let imagesInState = this.state.images
        imagesInState.forEach((img,count) => {
          firebase.storage().ref(`images/pets/${petID}/P-${count}`).getDownloadURL().then((url)=>{
            firebase.database().ref().child(`pets/${petID}/imageUrls`).push({
              url
            })
          })
        })
        firebase.database().ref().child(`pets/${petID}`).update({
          ...valuesToSend,
          idFundacion: this.props.currentUser.uid,
        })
      }).then(() => {
        Alert.alert('\u2b50 Success \u2b50','Mascota añadida con éxito')
        this.props.navigation.goBack()
      })
      .catch((err) => {
        console.log('Error Subiendo Fotos:', err)
        Alert.alert('Hubo un error',' :( ')
        this.setState({blockButton: false})
      })
    }
  }
  _upLoadPhotos= async ()=>{
    let PromisesImages = []
    let imagesInState = this.state.images
    imagesInState.forEach( (img,count)=>{
      let petID = this.state.pet_fire_key
      let fileName = `P-${count}`
      PromisesImages.push( this._uploadImage( img, petID, fileName) )
    })
    return Promise.all(PromisesImages);
  }
  _uploadImage = async (uri,fundId,fotoName) => {
    // console.log('uploadImage:',uri,fotoName)
    const response = await fetch(uri)
    const blop = await response.blob()
    let storage_ref = `images/pets/${fundId}/${fotoName}`
    var ref = firebase.storage().ref().child(storage_ref)
    return ref.put(blop)
  }
  
  _setValuesMascota(values){
    // console.log(values)
    let result =  _.pickBy(values, (value)=>{
      return !value === false
    }) 
    if(_.some(values, (val)=> val==='')){
      return false
    }else{
      return result
    }
  }

  //console.log(Object.values(val).some(el => el === '') )

  _onCamera = async () => {
    this.setState({fetchingImages:true})
    let result = await ImagePicker.launchCameraAsync()
    // console.log('RESULT ',result)
    if(!result.cancelled){
      this.setState({
        images: [...this.state.images , result.uri],
        fetchingImages: false
      })
    }else{
      this.setState({ fetchingImages: false })
    }
  }
  _onGalery = async () => {
    this.setState({fetchingImages:true})
    let result = await ImagePicker.launchImageLibraryAsync()
    // console.log('RESULT ',result)
    if(!result.cancelled){
      this.setState({
        images: [...this.state.images , result.uri ],
        fetchingImages: false
      })
    }else{
      this.setState({ fetchingImages: false })
    }
  }

  renderImageItem({item}){
    return (
      <View>
        <Image resizeMode='contain' style={styles.petImage} source={{uri: item}}/>
      </View>
    )
  }

	render() {
    let imagesPupers = this.state.images
    // console.log('images: ',this.state.images)
    // console.log('petKey',this.state.pet_fire_key)
		return (
			<Container>
				<Content padder>
					<View style={{marginTop:5}}/>
          {imagesPupers?<Text style={styles.textHeaders}>Fotos:</Text>:null}
          {this.state.fetchingImages?
            <ActivityIndicator size="small" /> 
          :
          <FlatList horizontal style={{backgroundColor:'#F2F2F2',marginBottom:8}}
              data={imagesPupers}
              bounces={true}
              showsHorizontalScrollIndicator={true}
              renderItem={this.renderImageItem}
              keyExtractor={(item) => {return `${item}` }}
            />
          } 
          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
						<Button bordered onPress={this._onGalery}>
							<Text primary>Galería +</Text>
						</Button>
            {/* <Button bordered onPress={this._onCamera}>
							<Text primary>Cámara +</Text>
						</Button> */}
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
  petImage:{
    width:160,
    height:120
  },
});