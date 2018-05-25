import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, ImageBackground} from 'react-native'
import {connect} from 'react-redux'

//Style
import { Button, Icon, Thumbnail, Text, Item, Input, 
				Card, CardItem, Content, Left, ListItem, Body, List,
				Right, Label} from 'native-base'
import images from '../../../assets/images'
import { Ionicons } from '@expo/vector-icons';

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
					<View style={{backgroundColor:'#ffffff'}}>
						<View style={{marginTop:20}}/>	
						<ListItem avatar noBorder>
							<Left>
								<Thumbnail 
								style={{borderColor: '#2a2a2a59', borderWidth:5, marginTop: 15}} 
								rounded large source={images.angel_kitty}/>
							</Left>
							<Body>
								<Text style={{fontSize: 20, fontWeight:'bold', marginBottom:10}}>Nombre del perrito</Text>
								<Text note>
									<Ionicons name="md-paw" size={(15)} color="rgb(75, 75, 73)"/> Perro o gato
								</Text>
								<Text note>
									<Ionicons name="md-sunny" size={(15)} color="rgb(75, 75, 73)"/> Macho o hembra
								</Text>								
								<Text note>
									<Ionicons name="md-cloudy-night" size={(15)} color="rgb(75, 75, 73)"/> Edad
								</Text>
								<Text note>
									<Ionicons name="md-shirt" size={(15)} color="rgb(75, 75, 73)"/> Tamaño
								</Text>
							</Body>
						</ListItem>
						<View style={{marginTop:30}}/>
						<View style={{marginHorizontal: 10, marginBottom: 10}}> 											
							<Card> 
								<CardItem
									button
									onPress={this.addVoluntario}
									style={{backgroundColor: '#FFFFFF'}}>
									<Left>
										<Thumbnail source={images.medal}/>
										<Body>
											<Text note>¡Quiero ofrecerme como voluntari@!</Text>
											<Text style={{fontWeight: 'bold'}}>Enviar Solicitud</Text>
										</Body>
									</Left>
								</CardItem>
							</Card>
						</View>
					</View>
					<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
						<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>PERSONALIDAD</Text></Left>
					</ListItem>
					<View style={{margin: 20}}>
						<Text style={{textAlign: 'justify'}}>
							Espacio para describir la personalidad de la mascota.
						</Text>
					</View>
					<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
						<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>CUIDADOS ESPECIALES</Text></Left>
					</ListItem>
					<View style={{margin: 20}}>
						<Text style={{textAlign: 'justify'}}>
							Espacio para escribir los cuidados especiales que tiene la mascota.
						</Text>
					</View>
					<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
						<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>REQUERIMIENTOS</Text></Left>
					</ListItem>
					<List>
            <ListItem>
              <Thumbnail square size={80} source={images.wonder_kitty} />
              <Body>
                <Text note>Tipo de hogar</Text>
                <Text>Descripcion del tipo de hogar que se requiere</Text>
              </Body>
            </ListItem>
						<ListItem>
              <Thumbnail square size={80} source={images.wonder_kitty} />
              <Body>
                <Text note>Tiempo minimo de cuidado</Text>
                <Text>Una semana</Text>
              </Body>
            </ListItem>
          </List>
					<ListItem itemDivider style={{backgroundColor:'#ffffff'}}>
						<Left><Text style={{textAlign:'center', fontWeight:'bold'}}>FOTOS</Text></Left>
					</ListItem>
					<View style={{margin: 20}}>
						<Text style={{textAlign: 'justify'}}>
							Espacio para poner las fotos de la mascota / estilo las que salen en noticias.
						</Text>
					</View>
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