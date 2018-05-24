import _ from 'lodash'
import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
import firebase from '../../firebase/firebaseSingleton'
import { ImagePicker } from 'expo'
import DatePicker from 'react-native-datepicker'
import {_getNowDateISO, _getNextYear} from '../../utils/random_functions'
//Style
import Modal from 'react-native-modal'
import {Container,Content,Card,Body,Button,Text,Icon,Form,Textarea,CheckBox,List,ListItem,Label,Input,Item, Toast} from 'native-base'
import {randomPuppers} from '../../utils/random_functions'
import { FlatList } from 'react-native-gesture-handler'
import Imagess from '../../../assets/images'
import {Ionicons} from '@expo/vector-icons'
import photoActions from '../../actions/photoActions'

class createNew extends Component {
	constructor(props) {
    super(props);
    this.state={
      images:[],
      fetchingImages:false,
      title:'test',
      date: '',
      evento:true, noticia:null,

      new_fire_key: firebase.database().ref().child('news').push().key,
      blockButton: false,
      isModalVisible: false
    }

    this._añadirNew=this._añadirNew.bind(this)
    this.renderImageItem=this.renderImageItem.bind(this)
  }
  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Añadir Noticia',
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
    this.props.navigation.setParams({ addPet: this._añadirNew })
  }

  _toggleModal = () =>{
    if(!this.state.blockButton){
      this.setState({ isModalVisible: !this.state.isModalVisible })
      this.props.navigation.goBack()
    }
  }

  renderDatePicker = () => {
    return <View style={{margin: -10}}><DatePicker
      style={{width: 200}}
      date={this.state.date}
      mode="date"
      placeholder="selecciona fecha"
      format="YYYY-MM-DD"
      minDate={_getNowDateISO()}
      maxDate={_getNextYear()}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 36
        }
        // ... You can check the source to find the other keys.
      }}
      onDateChange={(date) => {this.setState({date: date})}}
    /></View>
  }
  _añadirNew(){
    let valuesToSend = this._setValuesNew(this.state)
    let newID = this.state.new_fire_key
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
          firebase.storage().ref(`images/news/${newID}/P-${count}`).getDownloadURL().then((url)=>{
            firebase.database().ref().child(`news/${newID}/imageUrls`).push({
              url
            })
          })
        })
        firebase.database().ref().child(`news/${newID}`).update({
          ...valuesToSend,
          idFundacion: this.props.currentUser.uid,
        })
      }).then(() => {
        Toast.show({
          text:'Noticia subida con éxito  \u2661',
          buttonText:'Ok',
          duration: 4000,
          type:'success'
        })
        this.setState({blockButton: false})

      })
      .catch((err) => {
        this.setState({blockButton: false, isModalVisible: false})
        console.log('Error:', err)
        Alert.alert('Error:',' Hubo un error subiendo tu noticia.')
      })
    }
  }
  _upLoadPhotos = async ()=>{
    let PromisesImages = []
    let imagesInState = this.state.images
    imagesInState.forEach( (img,count)=>{
      let newID = this.state.new_fire_key
      let fileName = `P-${count}`
      PromisesImages.push( photoActions._uploadImage( img, newID, fileName) )
    })
    return Promise.all(PromisesImages);
  }
  // aqui iba _uploadImages (merge proof)
  
  _setValuesNew(values){
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
    // console.log('petKey',this.state.new_fire_key)
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
                <Text style={styles.modalTextHead}>Noticia Añadida     </Text>
                <Ionicons name='md-checkmark-circle-outline' size={24} color='green' />
              </View>
              }

              <Image resizeMode='contain' style={{height:140,width:null, marginVertical:20}} source={Imagess.computer_kitty} />
              
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
          {imagesPupers&&<Label>Fotos</Label>}
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
          <Item stackedLabel>
            <Label> Título </Label>
            <Input onChangeText={(text)=> this.setState({title: text})} />
          </Item>
          <View style={{marginTop:20}}/>
          <Item stackedLabel>
            <Label> Fecha </Label>
            {this.renderDatePicker()}
          </Item>
          <View style={{marginTop:20}}/>
          <Label> Descripcion </Label>
          <Textarea bordered placeholder='Best. Doggo. Party. Ever...'
          autoCorrect={true}
          value={this.state.description}
          onChangeText={(text)=> this.setState({description: text})} 
          />
          <View style={{marginTop:10}}/>
          <Label> Tipo </Label>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({evento:!this.state.evento ,noticia:false})}} 
                checked={this.state.evento}/>
              <Label style={{paddingLeft:15}}>Evento</Label>
            </ListItem>
            <ListItem>
              <CheckBox onPress={()=>{this.setState({noticia:!this.state.noticia ,evento:false})}} 
                checked={this.state.noticia} />
              <Label style={{paddingLeft:15}}>Noticia</Label>
            </ListItem>
        
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
export default connect(mapStateToProps)(createNew)

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