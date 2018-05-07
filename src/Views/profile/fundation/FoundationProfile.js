import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, 
					Alert, ActivityIndicator, ScrollView, FlatList} from 'react-native'
import {connect} from 'react-redux'
import foundationsActions from '../../../actions/foundationsActions'
//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
					Card, CardItem, Content, Left } from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'

class FundationProfileView extends Component {
	constructor(props) {
		super(props);
		this.state={
			data: [],
			pets: []
		}
		this.renderPets = this.renderPets.bind(this)
	}

	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Perfil'
    }
	}

	componentWillMount() {
		let params = this.props.navigation.state.params
		foundationsActions.fetchByUID(params.foundationID).then((val)=>{
			this.setState({data: val})
		})
		foundationsActions.fetchFoundationPets(params.foundationID).then((val)=>{
			this.setState({pets: val})
		})
	}

	renderPets({item, index}) {
		let pets = this.state.pets
		return <Card key={item} style={styles.petCard}>
						<CardItem>
								<View style={styles.petCardContent}>
									<Thumbnail circle small source={{ uri: 'https://pbs.twimg.com/profile_images/828073361397932032/eKTigt-2_400x400.jpg' }}/>
									<Text note> {pets[item].edad} años </Text>
								</View>
						</CardItem>
				</Card>
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
						info ?(
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
						):(
							<View style={styles.infoContainer}>
									<Text style={styles.infoField}>
										Nobody here :(
									</Text>
							</View>
						)
					}
					<View>
						<View style={styles.subtitle}><Text> Mascotas </Text></View>
						{
							pets ? (
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
							):(
								<View style={styles.infoContainer}>
										<Text style={styles.infoField}>
										No hay mascotas :(
										</Text>
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