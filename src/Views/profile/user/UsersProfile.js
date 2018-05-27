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
import { Ionicons } from '@expo/vector-icons';

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
								<Text style={{textAlign:'center', marginTop:5}} numberOfLines={1} note> {foundation[item].givenName ? 
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
					<View style={{flex: 1}}>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{uri: data.fundInfo.photoUrl}} />
              </Left>
								<Body>
                  <Text>Comentario</Text>
									<Text numberOfLines={3} note style={{marginVertical:10}}>
										{data.ratingMsg}
									</Text>
									<Text note><Ionicons name="md-person" size={(15)} color="rgb(75, 75, 73)"/>  {data.fundInfo.name}</Text>
									<Text note><Ionicons name="md-paw" size={(15)} color="rgb(75, 75, 73)"/>  Mascota {data.petInfo.tempName}</Text>
                	<Text note><Ionicons name="md-hand" size={(15)} color="rgb(75, 75, 73)"/>  {data.type.toUpperCase()}</Text>
                </Body>
							<Right>
								{data.rating&&<Text>
									{data.rating} <Ionicons name="md-star" size={(20)} color="rgb(75, 75, 73)"/> 
								</Text>}
							</Right> 
            </ListItem>
          </View>
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
								<View style={{backgroundColor:'#ffffff'}}>
									<View style={{marginTop:20}}/>	
									<ListItem avatar noBorder>
										<Left>
											<Thumbnail 
											style={{borderColor: '#2a2a2a59', borderWidth:5, marginTop: 15}} 
											rounded large source={{ uri: info.photoUrl }}/>
										</Left>
										<Body>
											<Text style={{fontSize: 20, fontWeight:'bold', marginBottom:10}}>{info.name}</Text>
											{profile&&<Text note style={{marginBottom:10}}>{profile.description}</Text>}
											<Text note>
											<Ionicons name="md-globe" size={(15)} color="rgb(75, 75, 73)"/> Ciudad
											</Text>
										</Body>
									</ListItem>
									<View style={{marginTop:30}}/>	
								</View>

								<View style={styles.subtitle}>
									<ListItem itemDivider style={{justifyContent:'space-between', backgroundColor:'#ffffff'}}>
										<Text style={styles.dividerText}>FUNDACIONES</Text>
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
														keyExtractor={ (item, index) => {return `${index}` } }/>
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
									<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
										<Left><Text style={styles.dividerText}>ÚLTIMOS SERVICIOS</Text></Left>
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
												<ListItem noBorder>
													<Body style={{borderBottomWidth: 0}}> 
														<Text style={{color: '#2a2a2a'}}>No hay servicios todavía :(</Text>
													</Body>
													<Right style={{borderBottomWidth: 0}}>
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