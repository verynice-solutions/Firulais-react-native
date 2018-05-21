import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'
import NavigationService from '../../routes/NavigationService'
//Style
import {Container,Content,Header,Left, Right,Title ,Button,Text, Icon,Thumbnail} from 'native-base'
import {Card, CardItem, Body } from 'native-base'
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'
import images from '../../../assets/images'

class HomeFundation extends Component {
	constructor(props) {
		super(props);
		this._goToaddPet=this._goToaddPet.bind(this)
		this._goToaddNew=this._goToaddNew.bind(this)
  }
  _goToaddPet(){
		this.props.navigation.navigate('AddPet')
	}
	_goToaddNew(){
		this.props.navigation.navigate('AddNew')
	}

	render() {
		let {user} = this.props.currentUser
		return (
			<Container>
				<Content>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10,	marginTop: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={()=>this.props.navigation.navigate('AddPet')} 
								style={{justifyContent:'center', backgroundColor: '#FFA6BD'}}>
								<Image 
									source={images.pencil_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Añadir mascota
								</Text>	
							</CardItem>
						</Card>						
					</View>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={()=>this.props.navigation.navigate('MyServicesView',{isFoundation:true})}
								style={{justifyContent:'center', backgroundColor: '#AE86A9'}}>
								<Image 
									source={images.idea_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Ver solicitudes
								</Text>	
							</CardItem>
						</Card>	
					</View>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={this._goToaddNew}
								style={{justifyContent:'center', backgroundColor: '#FFDBB9'}}>
								<Image 
									source={images.computer_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Añadir noticia/evento
								</Text>	
							</CardItem>
						</Card>	
					</View>

				</Content>
			</Container>
		)
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(HomeFundation)

const styles = StyleSheet.create({

});