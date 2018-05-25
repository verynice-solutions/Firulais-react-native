import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, 
	Alert, ActivityIndicator, ScrollView, FlatList, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
import foundationsActions from '../../../actions/foundationsActions'
import userActions from '../../../actions/usersActions'

//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
				Card, CardItem, Content, Left, ListItem, Body,
				Right, Label} from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'
import images from '../../../../assets/images'

class UsersProfile extends Component {
	constructor(props) {
		super(props);
		this.state={
			data: [],
			foundations: [],
			services: [],
			isFetchingFoundations: true,
			isFetchingServices: true
		}
		this.renderFoundations = this.renderFoundations.bind(this)
		this.renderServices = this.renderServices.bind(this)
	}

	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		if(params.myperfil){
			return{
				title: 'Voluntario: Mi perfil',
				headerRight: (Platform.OS==='ios'?
					<Button transparent onPress={()=>navigation.navigate('EditProfile')}>
						<Text primary>Editar</Text>
					</Button>
				:
				<Button transparent style={{marginTop: 8}} onPress={()=>navigation.navigate('EditProfile')}>
					<Text primary style={{fontSize:16}} >Editar</Text>
				</Button>)
			}
		}else{
			return{
				title:'Voluntario'
			}
		}
	}

	componentDidMount() {
		let params = this.props.navigation.state.params
		if(this.props.currentUser.uid===params.userID){this.props.navigation.setParams({ myperfil: true })}
		let promise1 = foundationsActions.fetchByUID(params.userID).then((val)=>{
			this.setState({data: val})
		})
		let promise2 = userActions.fetchUserFoundations(params.userID).then((val)=>{
			this.setState({foundations: val, isFetchingFoundations: false})
		})
		let promise3 = userActions.fetchNUserServices(params.userID, 3).then((val)=>{
			this.setState({services: val, isFetchingServices: false})
		})
	}

	renderFoundations({item, index}) {
		let { navigate } = this.props.navigation
		let foundation = this.state.foundations
		let imgURL = foundation[item].thumbnail
		return(
			<TouchableOpacity onPress={()=> navigate('FoundationProfile', { foundationID: foundation[item].funId })}>
				<Card key={item} style={styles.petCard}>
					<CardItem>
							<View style={styles.petCardContent}>
							<Thumbnail circle large source={{ uri: imgURL}}/> 
								<Text style={{textAlign:'center'}} numberOfLines={1} note> {foundation[item].givenName ? 
									foundation[item].givenName : foundation[item].name}</Text>
							</View>
					</CardItem>
				</Card>

			</TouchableOpacity>
		)
	}

	renderServices({item, index}) {
		// let { navigate } = this.props.navigation
		let service = this.state.services
		let data = service[item]
		let imgURL = service[item].thumbnail
		if(service[item].status === 'finalizado'){
			return(
					// <Card key={item} style={styles.serviceCard}>
					// 	<CardItem>
					// 		<View style={styles.petCardContent}>
					// 			<Thumbnail circle large source={{ uri: imgURL}}/> 
					// 			<Text style={{textAlign:'center'}} note>{service[item].rating? service[item].rating+'\u2b50' : ''} </Text>
					// 		</View>
					// 	</CardItem>
					// </Card>
					<Card style={{flex: 1}}>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{uri: data.fundInfo.photoUrl}} />
              </Left>
								<Body>
                  <Text>{data.fundInfo.name}</Text>
                  <Text note>{data.type.toUpperCase()}</Text>
                </Body>
							<Right>
								<Text note>
									{data.rating? data.rating+'\u2b50' : ''} 
								</Text>
							</Right>
            </ListItem>
            <ListItem>
							<Left>
								<Thumbnail large source={{uri: imgURL}}/>
							</Left>
							<Body style={{flexDirection: 'column'}}>
								<Label> Comentario </Label>
								<Text numberOfLines={3} note>
									{data.ratingMsg}
								</Text>
							</Body>
            </ListItem>
          </Card>
				)
		}else {
			return null
		}
		
	}

	render() {
		const { navigate } = this.props.navigation
		let info = this.state.data
		let foundations = this.state.foundations
		let services = this.state.services 
		let profile = info.profile
		return (
			<ScrollView style={{flex:1}}>
				<View style={{ flexDirection:'column'}}>
					{
						info ?(
							<View>
								<View>
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
										<Text style={styles.infoField}> {profile.description}  </Text>
									</View>}										
								</View>

								<View style={styles.subtitle}>
									<ListItem itemDivider style={{justifyContent:'space-between'}}>
										<Text style={styles.dividerText}>Fundaciones</Text>
										<TouchableOpacity onPress={ ()=> navigate('AllFoundationsView') }>
											<Text style={styles.dividerText}> Ver más...</Text>
										</TouchableOpacity>
									</ListItem> 
									
								</View>
								{
									this.state.isFetchingFoundations ? (
										<View style={styles.infoContainer}>
											<ActivityIndicator size='large' />
										</View>
									):(
										<View style={styles.cardsContainer}>
											{
												foundations?
														<FlatList data={Object.keys(foundations)}
															horizontal
															showsHorizontalScrollIndicator={false}
															bounces={true}
															renderItem={this.renderFoundations}
															keyExtractor={ (item, index) => {return `${index}` } }
														/>
												:
													<View style={styles.infoContainer}>
														<Text style={styles.infoField}>
														No fundaciones suscritas :(
														</Text>
													</View>
											}
										</View>
									)
								}
								<View style={styles.subtitle}>
									<ListItem itemDivider>
										<Left><Text style={styles.dividerText}>Últimos Servicios</Text></Left>
									</ListItem> 
								</View>
								{
									this.state.isFetchingServices ? (
										<View style={styles.infoContainer}>
											<ActivityIndicator size='large' />
										</View>
									):(							
										services? (
											<View >
											<FlatList data={Object.keys(services)}
												vertical
												showsHorizontalScrollIndicator={false}
												bounces={true}
												renderItem={this.renderServices}
												keyExtractor={ (item, index) => {return `${index}` } }
											/>		
											</View>											
										):(
											<View>
												<ListItem>
													<Body> 
														<Text style={{color: '#2a2a2a'}}>No hay servicios todavía :(</Text>
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
						):(
							<View style={styles.infoContainer}>
									<Text style={styles.infoField}>
										Nobody here :(
									</Text>
							</View>
						)
					}

				</View>
			</ScrollView>
		)
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(UsersProfile)

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