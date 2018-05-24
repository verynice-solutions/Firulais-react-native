import _ from 'lodash'
import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
import firebase from '../../firebase/firebaseSingleton'
import { ImagePicker } from 'expo'
//Style
import Modal from 'react-native-modal'
import {Container,Content,Button,Text,Textarea,CheckBox,ListItem,Toast,Card} from 'native-base'
import {randomPuppers} from '../../utils/random_functions'
import { FlatList } from 'react-native-gesture-handler';
import Imagess from '../../../assets/images'
import {Ionicons} from '@expo/vector-icons'
import photoActions from '../../actions/photoActions'

class AddPet extends Component {
	constructor(props) {
    super(props);
    this.state={
      images:[],
      fetchingImages:false,
      tempName:'',
      description:'',
      dog:true, cat:null,
      pequeño:true, mediano:null, grande:null,
      hembra:true, macho:null,
      edad:'2',
      amigableConPersonas: true,
      amigableConOtrosPets: true,
      pet_fire_key: firebase.database().ref().child('pets').push().key,
      blockButton: false,
      isModalVisible: false
    }

    this._añadirMascota=this._añadirMascota.bind(this)
    this.renderImageItem=this.renderImageItem.bind(this)
  }
  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Añadir mascota',
      headerRight: (Platform.OS==='ios'?
      <Button transparent onPress={params.addPet}>
        <Text primary>Guardar</Text>
      </Button>
    :
    <Button transparent style={{marginTop: 8}} onPress={params.addPet}>
      <Text primary style={{fontSize:16}} >Guardar</Text>
    </Button>)
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({ addPet: this._añadirMascota })
  }

  _toggleModal = () =>{
    if(!this.state.blockButton){
      this.setState({ isModalVisible: !this.state.isModalVisible })
      this.props.navigation.goBack()
    }
  }

  _añadirMascota(){
    let valuesToSend = this._setValuesMascota(this.state)
    let petID = this.state.pet_fire_key
    if(valuesToSend===false) {
      Toast.show({
        text:'Recuerda llenar todos los campos \u2661',
        buttonText:'Ok',
        duration: 4000,
        type:'warning'
      })
    }else {
      this.setState({blockButton: true, isModalVisible: true})
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
        Toast.show({
          text:'Mascota subida con éxito \u2b50',
          buttonText:'YAY!',
          duration: 4000,
          type:'success'
        })
        this.setState({blockButton: false})
      })
      .catch((err) => {
        this.setState({blockButton: false, isModalVisible: false})
        console.log('Error:', err)
        Alert.alert('Error:','Hubo un error subiendo tu mascota.')
      })
    }
  }
  _upLoadPhotos= async ()=>{
    let PromisesImages = []
    let imagesInState = this.state.images
    imagesInState.forEach( (img,count)=>{
      let petID = this.state.pet_fire_key
      let fileName = `P-${count}`
      PromisesImages.push( photoActions._uploadImage( img, petID, fileName ) )
    })
    return Promise.all(PromisesImages);
  }
  // aqui iba _uploadImages (merge proof)
  
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
    let result = await ImagePicker.launchCameraAsync({allowsEditing:true})
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
    let result = await ImagePicker.launchImageLibraryAsync({mediaTypes:"Images",allowsEditing:true})
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
  _deletePhoto = (uri) =>{
    this.setState({fetchingImages: true})
    let arrayImages = this.state.images.slice()
    // console.log('images in state: ',arrayImages)
    // console.log('uri key',uri)
    // console.log('indexOF',arrayImages.indexOf(uri))
    let index = arrayImages.indexOf(uri)
    arrayImages.splice(index,1)
    // console.log('new images: ', arrayImages)
    setTimeout(() => {
      this.setState({
        images: arrayImages, fetchingImages: false
      })
    }, 1000);
  }

  renderImageItem({item}){
    return (
      <Card style={{flex: 1}}>
        <Image resizeMode='contain' style={styles.petImage} source={{uri: item}}/>
        <TouchableOpacity style={{flexDirection:'row', justifyContent:'center',padding:5}} onPress={()=>this._deletePhoto(item)}>
          <Text> Quitar   </Text>
          <Ionicons name='md-close' size={20}/>
        </TouchableOpacity>
      </Card>
    )
  }

	render() {
    let imagesPupers = this.state.images
    // console.log('images: ',this.state.images)
    // console.log('petKey',this.state.pet_fire_key)
		return (
			<Container>
        {this.state.isModalVisible&&
          <Modal isVisible={this.state.isModalVisible}
          onBackButtonPress={()=>this._toggleModal()}
          onBackdropPress={()=>this._toggleModal()}
          >
            <View style={styles.modalContainer}>
          
              {this.state.blockButton? 
                <View style={styles.modalSpinningContainer}>
                  <Text style={{fontFamily:'Roboto-Bold',textAlign:'center'}}>Subiendo ...     </Text>
                  <ActivityIndicator size='large'/>
                </View>
              :
              <View style={styles.modalSpinningContainer}>
                <Text style={styles.modalTextHead}>Éxito     </Text>
                <Ionicons name='md-done-all' size={24} color='green' />
              </View>
              }

              <Image resizeMode='contain' style={{height:140,width:null, marginVertical:20}} source={Imagess.cat_selfi} />
              
              {!this.state.blockButton&&
                <View style={{justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity style={{width:250}} onPress={()=>this._toggleModal()}>
                    <Text style={styles.modalTexButton} > Oki </Text>
                  </TouchableOpacity>
                </View>
              }

            </View>
          </Modal>
        }
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
            <Button bordered onPress={this._onCamera}>
							<Text primary>Cámara +</Text>
						</Button>
					</View>
          <View style={{marginTop:20}}/>
          <Text> Cómo lo llamas? </Text>
          <Textarea bordered placeholder='Firulais...'
          autoCorrect={false}
          value={this.state.tempName}
          onChangeText={(text)=> this.setState({tempName: text})} 
          />
          <View style={{marginTop:10}}/>
          <Text> Que caracteristicas tiene? </Text>
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
  modalContainer:{ 
    justifyContent:'space-around',
    backgroundColor:'white', borderRadius: 8,
  },
  modalSpinningContainer:{
    flexDirection:'row', marginTop: 18,
    justifyContent:'center', alignItems:'center', 
  },
  modalImgContainer:{
    justifyContent:'center'
  },
  modalTextHead:{
    fontFamily:'Roboto-Bold',fontSize:18, 
    textAlign:'center'
  },
  modalTexButton:{
    fontFamily:'Roboto-Bold',fontSize:20, marginBottom:18, 
    textAlign:'center', color:'#3457d8'
  }
});