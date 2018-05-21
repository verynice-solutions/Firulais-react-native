import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, 
					Alert, ActivityIndicator, ScrollView, FlatList} from 'react-native'
import {connect} from 'react-redux'
//Accions
import foundationsActions from '../../../actions/foundationsActions'
import userActions from '../../../actions/usersActions'
//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
					Card, CardItem, Content, Left, ListItem, Body,
					Right} from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'
import CreateService from '../../services/CreateService'
import images from '../../../../assets/images'

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

	petTouched(mascotaId, fundacionId, userId,petObj) {
		if(this.props.currentUser.type == 'user') {
			this.props.navigation.navigate('CreateService',{toCreate:{petObj:petObj,fid:fundacionId,uid:userId}})
		}else{
			Alert.alert(
				'Oops',
				`Si quieres cuidar a una mascota tienes que ser usuario voluntario.`,
				[
					{text: 'OK'}
				],
				{ cancelable: true }
			)
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
			<TouchableOpacity onPress={()=>this.petTouched(item, pets[item].idFundacion, this.props.currentUser.uid, pets[item])}>
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
			<ScrollView style={{flex:1}}>
				<View style={{flexDirection:'column'}}>
					{
						this.state.isFetchingData?(
							<View style={styles.infoContainer}>
								<ActivityIndicator size='large' />
							</View>
						):(
							<View style={{backgroundColor: '#AE86A9'}}>
								<View style={styles.thumbContainer}>
									<Thumbnail 
										circle 
										large 
										source={{ uri: info.photoUrl }}
										style={{borderColor: '#FFFFFF59', borderWidth:5, marginTop: 15}}/>
									<Text style={styles.nameField}> 
										{info.name}
									</Text>
								</View>

								<View style={styles.infoContainer}>
									<Text style={styles.infoField}> {profile && profile.description  }  </Text>
								</View>
								{
									this.props.currentUser.type === 'user' &&(
										<View style={{marginHorizontal: 10, marginBottom: 10}}> 											
											<Card style={{ borderRadius:25}}> 
												<CardItem
													button
													onPress={this.addVoluntario}
													style={{backgroundColor: '#E8D6E6'}}>
													<Left>
														<Thumbnail source={images.medal}/>
														<Body>
															<Text style={{fontWeight: 'bold'}}>¡Quiero ser voluntario!</Text>
															<Text note>Apuntarme</Text>
														</Body>
													</Left>
												</CardItem>
											</Card>
										</View>
									)	
								}
							</View>
						)
					}
					<View>

						<View style={styles.subtitle}>
							<ListItem itemDivider>
								<Left><Text style={styles.dividerText}>Mascotas</Text></Left>
								<Right><Text style={styles.dividerText}>Ver más...</Text></Right>
							</ListItem> 
						</View>
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
								</View>
							)
						}
					</View>

					<View>
						<View style={styles.subtitle}>
							<ListItem itemDivider>
								<Left><Text style={styles.dividerText}>Noticias</Text></Left>
								<Right><Text style={styles.dividerText}>Ver más...</Text></Right>
							</ListItem> 
						</View>
						{
							news ? (
								<View style={styles.cardsContainer}>
	
								</View>
							):(
								<View>
									<ListItem>
										<Body> 
											<Text style={{color: '#2a2a2a'}}>No hay noticias :(</Text>
										</Body>
										<Right>
											<Thumbnail square size={80} 
												source={images.wonder_kitty}/>
										</Right>
									</ListItem>
								</View>
							)
						}					
					</View>



				</View>
			</ScrollView>
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
	},
	nameField: {
		textAlign:'center',
		fontWeight: 'bold',
		color: '#ffffff',
		marginTop: 15,
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