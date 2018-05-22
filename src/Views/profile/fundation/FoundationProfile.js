import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, 
					Alert, ActivityIndicator, ScrollView, FlatList, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
//Accions
import foundationsActions from '../../../actions/foundationsActions'
import userActions from '../../../actions/usersActions'
//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
					Card, CardItem, Content, Left, ListItem, Body,
					Right,Toast} from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'
import images from '../../../../assets/images'

class FundationProfileView extends Component {
	constructor(props) {
		super(props);
		this.state={
			data: [],
			pets: [],
			news: [],
			isFetchingData: true,
			isFetchingPets: true,
			isFetchingNews: true
		}
		this.renderPets = this.renderPets.bind(this)
		this.renderNews = this.renderNews.bind(this)
		this.petTouched = this.petTouched.bind(this)
		this.addVoluntario = this.addVoluntario.bind(this)
	}

	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Perfil: Fundación'
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
		let promise3 = await foundationsActions.fetchFoundationNews(params.foundationID).then((val)=>{
			// console.log('NEWSVALUES',val)
			this.setState({news: val, isFetchingNews: false})
		})
	}

	petTouched(mascotaId, fundacionId, userId,petObj) {
		if(this.props.currentUser.type == 'user' && this.state.data) {
			this.props.navigation.navigate('CreateService',{toCreate:{petObj:petObj,fid:fundacionId,uid:userId,fundObj:this.state.data}})
		}else{
			Toast.show({
				text:'Solo usuarios voluntario pueden cuidar mascotas',
				buttonText:'Ok',
				duration: 4000,
				type:'warning'
			})
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
	renderNews({item, index}) {
		let { navigate } = this.props.navigation
		let news = this.state.news
		let images = news[item].imageUrls
		let imgURL = images[Object.keys(images)[0]].url
		return(
			<TouchableOpacity onPress={()=> navigate('NewsView', { news: news[item] })}>
				<Card key={item} style={styles.petCard}>
					<CardItem>
							<View style={styles.petCardContent}>
							<Thumbnail circle large source={{ uri: imgURL}}/> 
								<Text note> {news[item].title}</Text>
							</View>
					</CardItem>
				</Card>

			</TouchableOpacity>
		)
	}
	render() {
		let info = this.state.data
		let pets = this.state.pets
		let news = this.state.news
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
								<ImageBackground
									style={{
										backgroundColor: '#ccc',
										flex: 1,
										position: 'absolute',
										width: '100%',
										height: '100%',
										justifyContent: 'center',
									}}
									source={images.purple_gradient}>
								</ImageBackground>	
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

								{profile&&<View style={styles.infoContainer}>
									<Text style={styles.infoField}> { profile.description  }  </Text>
								</View>}
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
								this.state.isFetchingNews ? (
									<View style={styles.infoContainer}>
										<ActivityIndicator size='large' />
									</View>
								):(
									news ? (
										<View style={styles.cardsContainer}>
											<FlatList data={Object.keys(news)}
												horizontal
												showsHorizontalScrollIndicator={false}
												bounces={true}
												renderItem={this.renderNews}
												keyExtractor={ (item, index) => {return `${index}` } }
											/>
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