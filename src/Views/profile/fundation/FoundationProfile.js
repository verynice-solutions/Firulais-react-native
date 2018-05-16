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

	petTouched(mascotaId, fundacionId, userId) {
		if(fundacionId !== userId) {
			this.props.navigation.navigate('CreateService',{toModal:{pid:mascotaId,fid:fundacionId,uid:userId}})
			
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

	renderPets({item, index}) {
		let pets = this.state.pets
		let images = pets[item].imageUrls
		return <TouchableOpacity onPress={()=>this.petTouched(item, pets[item].idFundacion, this.props.currentUser.uid)}><Card key={item} style={styles.petCard}>
						<CardItem>
								<View style={styles.petCardContent}>
									<Thumbnail circle small source={{ uri: images[Object.keys(images)[0]].url}}/>
									<Text note> {pets[item].edad} años </Text>
								</View>
						</CardItem>
				</Card></TouchableOpacity>
	}

	render() {
		let info = this.state.data
		let pets = this.state.pets
		
		let news = null
		let profile = info.profile
		return (
			<View style={{flex:1}}>
				<View style={{ flexDirection:'column'}}>
					{
						this.state.isFetchingData?(
							<View style={styles.infoContainer}>
								<Text style={styles.infoField}>
									Nobody here :(
								</Text>
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
										<Text style={styles.infoField}>
										No hay mascotas :(
										</Text>
								</View>
								
							):(
								<View style={styles.cardsContainer}>
									<FlatList data={Object.keys(pets)}
										horizontal
										showsHorizontalScrollIndicator={false}
										bounces={true}
										renderItem={this.renderPets}
										onEndReached={ this.props.onEndReached }
										keyExtractor={ (item, index) => {return `${index}` } }
										onEndReachedThreshold={0.5}
										keyboardShouldPersistTaps='never'
									/>
									<TouchableOpacity><Text style={styles.verMas} primary> Ver más... </Text></TouchableOpacity>
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
		backgroundColor: 'whitesmoke',
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