import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, ImageBackground} from 'react-native'
import {connect} from 'react-redux'

//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
				Card, CardItem, Content, Left, ListItem, Body,
				Right, Label} from 'native-base'
import images from '../../../assets/images'

class PetProfile extends Component {
	constructor(props) {
		super(props);
		this.state={

		}

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
				title:'Mascota: [nombre pet]'
			}
		}
	}

	componentDidMount() {
    
	}


	render() {
		
		return (
			<ScrollView style={{flex:1}}>
				<View style={{ flexDirection:'column'}}>

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