import _ from 'lodash'
import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
import firebase from '../../firebase/firebaseSingleton'
import { ImagePicker } from 'expo'
//Style
import Modal from 'react-native-modal'
import {Container,Content,Button,Text,Textarea,CheckBox,ListItem,
  Toast,Card,Picker,Label,Input,Item, Thumbnail} from 'native-base'
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
      tempName: null,
      caracteristicas: null,
      tipo: 'perro',
      tamaño: 'pequeño',
      genero: 'hembra',
      edad: 'Menos de 1 año',
      personalidad: null,
      tiempoMinCuidado: null,
      tiempoMinCuidadoRango:'dias',
      cuidadosEspeciales: null,
      hogarDeseado: null,
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
  _setValuesMascota(values){
    // console.log(values)
    let valuesToSend = {
      tempName: values.tempName,
      caracteristicas: values.caracteristicas,
      tipo: values.tipo,
      tamaño: values.tamaño,
      genero: values.genero,
      edad: values.edad,
      personalidad: values.personalidad,
      tiempoMinCuidado: values.tiempoMinCuidado,
      tiempoMinCuidadoRango: values.tiempoMinCuidadoRango,
      cuidadosEspeciales: values.cuidadosEspeciales,
      hogarDeseado: values.hogarDeseado,
      pet_fire_key: values.pet_fire_key
    }
    let obligatorios ={
      tempName: values.tempName,
      personalidad: values.personalidad,
      caracteristicas: values.caracteristicas,
      tipo: values.tipo,
      tamaño: values.tamaño,
      genero: values.genero,
      edad: values.edad,
    }

    if(_.isEmpty(values.images)){ return false }
    if( _.some(obligatorios, (val)=> (val===''||val===null)) ){
      return false
    }else{
      return valuesToSend
    }
  }

  _añadirMascota(){
    let valuesToSend = this._setValuesMascota(this.state)
    let petID = this.state.pet_fire_key
    let imagesInState = this.state.images
    if(valuesToSend===false) {
      Toast.show({
        text:'Recuerda llenar los campos marcados con *',
        buttonText:'Ok',
        duration: 4000,
        type:'danger'
      })
    }else {
      this.setState({blockButton: true, isModalVisible: true})
      this._upLoadPhotos()
        .then(() => {
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
          text:`Mascota subida con éxito \u2b50 \n Podrás ver a ${valuesToSend.tempName} en tu perfil`,
          buttonText:'YAY!',
          duration: 6000,
          type:'success'
        })
        this.setState({blockButton: false})
      })
      .catch((err) => {
        console.log('Error:', err)
        Alert.alert('Error:','Hubo un error subiendo tu mascota. Intenta cambiar de red a una más estable.')
        setTimeout(() => {
          this.setState({blockButton: false, isModalVisible: false})
        }, 6000);
      })
    }
  }
  _upLoadPhotos= async ()=>{
    let PromisesImages = []
    let imagesInState = this.state.images
    imagesInState.forEach( (img,count)=>{
      let petID = this.state.pet_fire_key
      let fileName = `P-${count}`
      PromisesImages.push( photoActions._uploadImage( img, petID, fileName,'pets') )
    })
    return Promise.all(PromisesImages);
  }
  
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
    let index = arrayImages.indexOf(uri)
    arrayImages.splice(index,1)
    setTimeout(() => {
      this.setState({
        images: arrayImages, fetchingImages: false
      })
    }, 1000);
  }

  renderImageItem({item,index}){
    return (
      <Card style={{flex: 1}}>
        {index==0?
        <View style={{justifyContent:'center',alignItems: 'center', width:160,
        height:120}}>
          <Text style={{textAlign:'center',paddingBottom:5}}>Principal</Text>
          <Thumbnail circular source={{uri: item}} style={styles.profileFoto} />
        </View>
        :
        <Image resizeMode='contain' style={styles.petImage} source={{uri: item}}/>
        }
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
          {imagesPupers?<Text style={styles.textHeaders}>Añade fotos de tu mascota <Text style={{color:'red'}}>*</Text></Text>:null}
          {this.state.fetchingImages?
            <View style={{paddingVertical:15}}>
              <ActivityIndicator size="small" />
            </View> 
          :
          <FlatList horizontal style={{backgroundColor:'#F2F2F2',marginBottom:8}}
              data={imagesPupers}
              bounces={true}
              showsHorizontalScrollIndicator={true}
              renderItem={this.renderImageItem}
              keyExtractor={(item) => {return `${item}` }}
            />
          } 

          <View style={{marginTop:10, flexDirection:'row',justifyContent:'space-around'}}>
						<Button bordered onPress={this._onGalery} style={{flex: 0.45}}>
							<Text primary style={{textAlign:'center'}}>Desde la galería</Text>
						</Button>
            <Button bordered onPress={this._onCamera} style={{flex: 0.45}}>
							<Text primary style={{textAlign:'center'}}>Tómale una foto</Text>
						</Button>
					</View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textHeaders}>Nombre <Text style={{color:'red'}}>*</Text></Text>
            <Item fixedLabel>
              <Input bordered placeholder='¿Cómo se llama tu mascota?'
              autoCorrect={false}
              value={this.state.tempName}
              onChangeText={(text)=> this.setState({tempName: text})} 
              />
            </Item>
          </View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textHeaders}>Personalidad <Text style={{color:'red'}}>*</Text></Text>
            <Textarea bordered placeholder='Describe como es el comportamiento de tu mascota.
            (ej. jugueton, cariñoso, etc)'
            autoCorrect={true}
            value={this.state.personalidad}
            onChangeText={(text)=> this.setState({personalidad: text})} 
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.textHeaders}> Tipo <Text style={{color:'red'}}>*</Text></Text>
            <Picker
              mode="dropdown"
              placeholder="Tipo de mascota:"
              iosHeader="Tipo de mascota"
              iosIcon={<Ionicons name="ios-arrow-down-outline" />}
              headerBackButtonText="Atrás"
              selectedValue={this.state.tipo}
              onValueChange={(value)=>{this.setState({tipo: value})}}>
              <Picker.Item label="Perro" value="perro" />
              <Picker.Item label="Gato" value="gato" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.textHeaders}> Tamaño <Text style={{color:'red'}}>*</Text></Text>
            <Picker
              mode="dropdown"
              placeholder="Tamaño:"
              iosHeader="Tamaño de tu mascota"
              iosIcon={<Ionicons name="ios-arrow-down-outline" />}
              headerBackButtonText="Atrás"
              selectedValue={this.state.tamaño}
              onValueChange={(value)=>{this.setState({tamaño: value})}}>
              <Picker.Item label="Pequeño" value="pequeño" />
              <Picker.Item label="Mediano" value="mediano" />
              <Picker.Item label="Grande" value="grande" />
            </Picker>
          </View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textHeaders}> Edad <Text style={{color:'red'}}>*</Text></Text>
            <Picker
              mode="dropdown"
              placeholder="¿Que edad tiene?"
              iosHeader="Edad de tu mascota"
              iosIcon={<Ionicons name="ios-arrow-down-outline" />}
              headerBackButtonText="Atrás"
              selectedValue={this.state.edad}
              onValueChange={(value)=>{this.setState({edad: value})}}>
              <Picker.Item label="Menos de 1 año" value="Menos de 1 año" />
              <Picker.Item label="1 ~ 2 años" value="1 ~ 2 años" />
              <Picker.Item label="3 ~ 10 años" value="3 ~ 10 años" />
              <Picker.Item label="Más de 10 años" value="Más de 10 años" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.textHeaders}> Género <Text style={{color:'red'}}>*</Text></Text>
            <Picker
              mode="dropdown"
              placeholder="Sexo de tu mascota"
              iosHeader="Sexo de tu mascota"
              iosIcon={<Ionicons name="ios-arrow-down-outline" />}
              headerBackButtonText="Atrás"
              selectedValue={this.state.genero}
              onValueChange={(value)=>{this.setState({genero: value})}}>
              <Picker.Item label="Hembra" value="hembra" />
              <Picker.Item label="Macho" value="macho" />
            </Picker>
          </View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textHeaders}>Características <Text style={{color:'red'}}>*</Text></Text>
            <Textarea bordered placeholder='¿Cuales son las características físicas de tu mascota?
            (ej. amarillo, peludito, de raza labrador...)'
            autoCorrect={true}
            value={this.state.caracteristicas}
            onChangeText={(text)=> this.setState({caracteristicas: text})}/>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.textHeaders}>Tiempo mínimo de cuidado </Text>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <Item fixedLabel style={{flex: 0.5}}>
                <Input placeholder="Cantidad" keyboardType='numeric'
                value={this.state.tiempoMinCuidado}
                onChangeText={(text)=> this.setState({tiempoMinCuidado: text})} />
              </Item>
              <Picker
                mode="dropdown"
                placeholder="Rango de tiempo"
                iosHeader="Rango de tiempo"
                iosIcon={<Ionicons name="ios-arrow-down-outline" />}
                headerBackButtonText="Atrás"
                selectedValue={this.state.tiempoMinCuidadoRango}
                onValueChange={(value)=>{this.setState({tiempoMinCuidadoRango: value})}}
                style={{ width: undefined, flex: 0.5 }}>
                <Picker.Item label="Dias" value="dias" />
                <Picker.Item label="Meses" value="meses" />
                <Picker.Item label="Años" value="años" />
              </Picker>
            </View>
          </View>

          <View style={styles.textAreaContainer}>
            <Text style={styles.textHeaders}>Tipo de Hogar </Text>
            <Textarea bordered placeholder='Describe las caracteristicas del hogar preferible para tu mascota. 
            (ej. lugar amplio con patio ...)'
            autoCorrect={true}
            value={this.state.hogarDeseado}
            onChangeText={(text)=> this.setState({hogarDeseado: text})} />

            <View style={{marginTop:20}}/>
            <Text style={styles.textHeaders}>Cuidados Especiales </Text>
            <Textarea bordered placeholder='Describe todos los cuidados especiales que tiene tu mascota. 
            (ej. medicinas, horarios ...)'
            autoCorrect={true}
            value={this.state.cuidadosEspeciales}
            onChangeText={(text)=> this.setState({cuidadosEspeciales: text})} />
          </View>
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
  profileFoto:{
    width: 84,
    height: 84,
    borderRadius: 84/2
  },
  pickerContainer:{
    flexDirection:'column',
    marginTop:20
  },
  textAreaContainer:{
    flexDirection:'column',
    marginTop:20
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
  },
  textHeaders:{
    fontWeight: 'bold'
  }
});