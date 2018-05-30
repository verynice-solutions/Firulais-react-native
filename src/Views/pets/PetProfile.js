import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
import Ripple from 'react-native-material-ripple'
//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
				Card, CardItem, Content, Left, ListItem, Body, List,
				Right, Label,Toast} from 'native-base'
import images from '../../../assets/images'
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
//Actions
import petActions from '../../actions/petActions'
import serviceActions from '../../actions/serviceActions'
class PetProfile extends Component {
	constructor(props) {
		super(props);
		this.state={
			petInfo: {},
			isFetchingPet: true
		}
		this.renderPics = this.renderPics.bind(this)
  }
  
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		if(params.myPet){
			return{
				title: 'Mi mascota',
				// headerRight: (Platform.OS==='ios'?
				// 	<Button transparent onPress={()=>navigation.navigate('EditProfile')}>
				// 		<Text primary>Editar</Text>
				// 	</Button>
				// :
				// <Button transparent style={{marginTop: 8}} onPress={()=>navigation.navigate('EditProfile')}>
				// 	<Text primary style={{fontSize:16}} >Editar</Text>
				// </Button>)
			}
		}else{
			return{
				title:'Mascota'
			}
		}
	}

	componentDidMount() {
		let params = this.props.navigation.state.params
		this.fetchEverything(params)
	}

	fetchEverything = async (params) =>{
		let promise = await petActions.fetchPetById(params.petId)
		.then((val)=>{
			this.setState({petInfo: val, isFetchingPet: false})
		});
	}
	_solicitarServicio = ()=>{
		let pet = this.state.petInfo
		let params = this.props.navigation.state.params
		let currentUserId = this.props.currentUser.uid
		// this.props.navigation.navigate('PetProfile',{petId: mascotaId, myPet: myPet })
		if(this.props.currentUser.type == 'user' && pet) {

			serviceActions.fetchUserServices(this.props.currentUser.uid).then((val)=>{
				let validate = false
				if(val){
					Object.keys(val).map((item, index)=>{
						if(val[item].petId == pet.pet_fire_key){
							if(val[item].status!='finalizado' && val[item].status!='rechazado'){
								validate = val[item].status
							}
						}
					})
				}
				if (validate){
					Toast.show({
						text:`Ya tienes una solicitud para esta mascota. \nEstá en estado: ${validate} \u2665`,
						buttonText:'Ok',
						duration: 6000
					})
				}else{
					this.props.navigation.navigate('CreateService',{toCreate: { petObj: pet, fid:pet.idFundacion, uid: currentUserId, fundObj:params.fundObj } })
				}
			})
			.catch(err=>{
				console.log('Error:', err)
			})

		}else{
			Toast.show({
				text:'Solo los voluntarios pueden cuidar mascotas',
				buttonText:'Ok',
				duration: 4000
			})
		}
	}

	renderPics({item}) {
    let img = item.url
    // console.log("item: ", item)
		return(
      <View style={styles.picContent}>
				<Image source={{uri: img}} resizeMode='contain' style={{height: 300, width: 300, flex: 1}}/>
      </View>
		)
	}
	
	render() {
		if(this.state.isFetchingPet){
			return (
				<View style={{ flex:1, justifyContent: 'center' }} >
					<ActivityIndicator size='large' />
				</View>
			)
		}else{
			let pet = this.state.petInfo
			let user = this.props.currentUser
			let petImages = pet.imageUrls
			let thumbnail = petImages[Object.keys(petImages)[0]].url
			let imagesArray = Object.values(petImages)
			return (
				<ScrollView style={{flex:1}}>
					<View style={{ flexDirection:'column'}}>
						<View style={{backgroundColor:'#ffffff'}}>
							<View style={{marginTop:20}}/>	
							<ListItem avatar noBorder>
								<Thumbnail 
								style={{width:120,height:120,borderRadius:120/2,borderColor: '#2a2a2a59', borderWidth:5, marginTop: 20}} 
								rounded large source={{uri: thumbnail}}/>
								<Body style={{borderBottomWidth:0, marginTop:10}}>
									<Text style={{fontSize: 20, fontWeight:'bold', marginBottom:10}}>{pet.tempName}</Text>
									{/* <Text note>
										<Ionicons name="md-paw" size={(15)} color="rgb(75, 75, 73)"/> {_.capitalize(pet.tipo)}
									</Text>
									<Text note>
										<Ionicons name={pet.genero=='macho'?'md-male':'md-female'} size={(15)} color="rgb(75, 75, 73)"/> {_.capitalize(pet.genero)}
									</Text>				
									<Text note>
										<MaterialCommunityIcons name="cake" size={(15)} color="rgb(75, 75, 73)"/> {_.capitalize(pet.edad)}
									</Text>
									<Text note>
									<MaterialCommunityIcons name="weight"  size={(15)} color="rgb(75, 75, 73)"/> {_.capitalize(pet.tamaño)}
									</Text> */}
								</Body>
							</ListItem>
							
							{user.type === 'user'&&<View style={{marginHorizontal: 10, marginBottom: 10,marginTop:20}}>	
								<Card>
									<Ripple onPress={()=>this._solicitarServicio()}> 
										<CardItem
											button
											onPress={()=>this._solicitarServicio()}
											style={{backgroundColor: '#FFFFFF'}}>
											<Left>
												<Thumbnail source={images.medal}/>
												<Body>
													<Text note>¡Quiero ofrecerme como voluntario!</Text>
													<Text style={{fontWeight: 'bold'}}>Enviar Solicitud</Text>
												</Body>
											</Left>
										</CardItem>
									</Ripple>
								</Card>
							</View>}
							
						</View>
						<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
							<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>PERSONALIDAD</Text></Left>
						</ListItem>
						<View style={{margin: 20}}>
							<Text style={{textAlign: 'justify'}}>
								{pet.personalidad}
							</Text>
						</View>

						{pet.cuidadosEspeciales&&<View><ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
							<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>CUIDADOS ESPECIALES</Text></Left>
						</ListItem>
						<View style={{margin: 20}}>
							<Text style={{textAlign: 'justify'}}>
								{pet.cuidadosEspeciales}
							</Text>
						</View></View>}

						{(pet.hogarDeseado||pet.tiempoMinCuidado)&&<View><ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
							<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>REQUERIMIENTOS</Text></Left>
						</ListItem>
						<List>
							{pet.hogarDeseado&&<ListItem>
								<Thumbnail square size={40} source={images.house_kawai} />
								<Body>
									<Text note>Tipo de hogar</Text>
									<Text>{pet.hogarDeseado}</Text>
								</Body>
							</ListItem>}
							{pet.tiempoMinCuidado&&<ListItem>
								<Thumbnail square size={40} source={images.calendar_kawai} />
								<Body>
									<Text note>Tiempo mínimo de cuidado</Text>
									<Text>{pet.tiempoMinCuidado} {pet.tiempoMinCuidadoRango}.</Text>
								</Body>
							</ListItem>}
						</List></View>}

						<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
							<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>CARACTERÍSTICAS </Text></Left>
						</ListItem>
						<View style={{margin: 20}}>
							<Text style={{textAlign: 'justify'}}>
								{pet.caracteristicas}
							</Text>
						</View>
						<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
							<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>FOTOS</Text></Left>
						</ListItem>
						<View style={{margin: 20}}>
						<View style={{flex:0.4,alignItems:'center'}}>
							<FlatList data={imagesArray}
								horizontal
								bounces={true}
								renderItem={this.renderPics}
								keyExtractor={ (item, index) => {return `${index}` } }/>
						</View>
						</View>
					</View>
				</ScrollView>
			)
		}
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(PetProfile)

const styles = StyleSheet.create({
	thumbContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10
	},
	infoContainer: {
		flexDirection:'column',
		justifyContent:'center',
		alignItems: 'center',
	},
	nameField: {
		textAlign:'center',
		fontWeight: 'bold',
		color: '#2a2a2a',
		marginTop: 15,
		fontSize: 20
	},
	infoField: {
		textAlign:'center', 
		width:'80%',
		color: '#ffffff',
		marginBottom: 30,
	},
	cardsContainer: {
		alignItems:'center', 
		paddingVertical: 5,
		marginBottom: 5  
	},
	petCard: {
		flex: 0,
		margin: 2,
		width: 120
	},
	serviceCard: {
		flex: 1,
		margin: 2,
		width: 120
	},
	petCardContent: {
		flex: 1,
		width: '100%',
		flexDirection: 'column',
		justifyContent:'center',
		alignItems: 'center'
	},
	subtitle: {
		marginBottom: 5
	},
	verMas: {
		margin: 5,
		fontFamily: 'Roboto-Bold',
		fontSize: 14
	},
	dividerText: {
		fontWeight: 'bold',
		color: '#2a2a2a'
	} 
});