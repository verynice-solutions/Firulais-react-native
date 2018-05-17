import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, 
					Alert, ActivityIndicator, ScrollView, FlatList} from 'react-native'
import {connect} from 'react-redux'
//Accions
import foundationsActions from '../../../actions/foundationsActions'
import userActions from '../../../actions/usersActions'
//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
					Card, CardItem, Content, Left } from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'
import CreateService from '../../services/CreateService'


class FundationProfileView extends Component {
	constructor(props) {
		super(props);
		this.state={
			data: [],
			pets: [],
			isFetchingData: true,
			isFetchingPets: true
		}
		this.renderPets = this.renderPets.bind(this)
		this.petTouched = this.petTouched.bind(this)
		this.addVoluntario = this.addVoluntario.bind(this)
	}

	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Perfil'
    }
	}
		
	componentDidMount() {
		let params = this.props.navigation.state.params
		this.setState({isFetchingData: true, isFetchingData: true})
		this.fetchEverything(params)
	}
	fetchEverything = async (params) =>{
		let promise = await foundationsActions.fetchByUID(params.foundationID).then((val)=>{ 
			// console.log('FUNDATIONVALUE',val)
			this.setState({data: val, isFetchingData: false})
		})
		let promise2 = await foundationsActions.fetchFoundationPets(params.foundationID).then((val)=>{
			// console.log('PETVALUES',val)
			this.setState({pets: val, isFetchingPets: false})
		})
	}
	createService(mascotaId, fundacionId, userId, objectMascota) {
		userActions.createService(mascotaId, fundacionId, userId, objectMascota);
	}

	petTouched(mascotaId, fundacionId, userId,images) {
		if(fundacionId !== userId) {
			this.props.navigation.navigate('CreateService',{toModal:{pid:mascotaId,fid:fundacionId,uid:userId,images:images}})
			// Alert.alert(
			// 	'Ayudar mascota',
			// 	`¿Quieres ayudar al amigo? ${fundacionId}`,
			// 	[
			// 		{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			// 		{text: 'OK', onPress: () => this.createService(mascotaId, fundacionId, userId)},
			// 	],
			// 	{ cancelable: false }
			// )
		}
	}

	addVoluntario() {
		let info = this.state.data
		let uid = this.props.currentUser.uid
		let fundId = this.props.navigation.state.params.foundationID
		let name = info.name
		let thumb = info.photoUrl
		Alert.alert('\u2b50','Se un voluntario!',[
			{text: 'YES!', onPress: () => userActions.addFoundationToUser(uid, fundId, name, thumb)},
		],
		{ cancelable: true })
	}

	renderPets({item, index}) {
		let pets = this.state.pets
		let images = pets[item].imageUrls
		let imgURL = images[Object.keys(images)[0]].url
		return(
			<TouchableOpacity onPress={()=>this.petTouched(item, pets[item].idFundacion, this.props.currentUser.uid,images)}>
				<Card key={item} style={styles.petCard}>
						<CardItem>
								<View style={styles.petCardContent}>
								<Thumbnail circle large source={{ uri: imgURL}}/> 
									<Text note> {pets[item].edad} años </Text>
								</View>
						</CardItem>
				</Card>
			</TouchableOpacity>
		)
	}
	render() {
		let info = this.state.data
		let pets = this.state.pets
		// console.log('info',info)
		let news = null
		let profile = info.profile
		return (
			<View style={{flex:1}}>
				<View style={{flexDirection:'column'}}>
					{
						this.state.isFetchingData?(
							<View style={styles.infoContainer}>
								<ActivityIndicator size='large' />
							</View>
						):(
							<View>
								<View style={styles.thumbContainer}>
									<Thumbnail circle large source={{ uri: info.photoUrl }}/>
									<Text style={styles.nameField}> 
										{info.name}
									</Text>
								</View>

								<View style={styles.infoContainer}>
									<Text style={styles.infoField}> {profile && profile.description  }  </Text>
								</View>
							</View>
						)
					}
					<View>
						<View style={styles.subtitle}><Text> Mascotas </Text></View>
						{
							this.state.isFetchingPets ? (
								<View style={styles.infoContainer}>
									<ActivityIndicator size='large' />
								</View>
								
							):(
								<View style={styles.cardsContainer}>
									{pets?
									<FlatList data={Object.keys(pets)}
										horizontal
										showsHorizontalScrollIndicator={false}
										bounces={true}
										renderItem={this.renderPets}
										keyExtractor={ (item, index) => {return `${index}` } }
									/>
									:
									<View style={styles.infoContainer}>
										<Text style={styles.infoField}>
											{info.givenName} no tiene mascotas todavía :(
										</Text>
									</View>
									}
										<TouchableOpacity>
											<Text style={styles.verMas} primary> Ver más... </Text>
										</TouchableOpacity>
								</View>
							)
						}
					</View>

					<View>
						<View style={styles.subtitle}><Text> Noticias </Text></View>
						{
							news ? (
								<View style={styles.cardsContainer}>
	
								</View>
							):(
								<View style={styles.infoContainer}>
										<Text style={styles.infoField}>
										No hay Noticias :(
										</Text>
								</View>
							)
						}
					</View>

					{
						this.props.currentUser.type === 'user' &&(
							<View style={styles.infoContainer}>
								<View>
									<Button iconLeft rounded onPress={this.addVoluntario}>
										<Icon name='paw'/>
										<Text> Se un voluntario! </Text>
									</Button>
								</View>
							</View>
						)	
					}

			</View>
		</View>
	)}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(FundationProfileView)

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
		marginBottom: 10
	},
	nameField: {
		textAlign:'center',
		marginTop: 5
	},
	infoField: {
		textAlign:'center', 
		width:'80%'
	},
	cardsContainer: {
		alignItems:'center', 
		paddingVertical: 5  
	},
	petCard: {
		flex: 0,
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
	}

});