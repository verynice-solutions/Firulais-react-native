import React, { Component } from 'react'

import { Platform,	Text,	View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'

//Style
import {Header, Left, Right, Title ,Button, Icon, Thumbnail, Container, Content, Card, CardItem, Body} from 'native-base'
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'
import images from '../../../assets/images'

class HomeUser extends Component {
	constructor(props) {
		super(props);
  }
  
	render() {
		let {user} = this.props.currentUser
		// console.log('Current user:',this.props.currentUser)
		return (
			<Container>
				<Content>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10,	marginTop: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={()=>this.props.navigation.navigate('AllFoundationsView')}
								style={{justifyContent:'center', backgroundColor: '#AE86A9'}}>
								<Image 
									source={images.care_home} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Ver fundaciones
								</Text>	
							</CardItem>
						</Card>	
					</View>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button
								onPress={()=>this.props.navigation.navigate('AllNewsView')}
								style={{justifyContent:'center', backgroundColor: '#FFA6BD'}}>
								<Image 
									source={images.party_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Ver noticias/eventos
								</Text>	
							</CardItem>
						</Card>						
					</View>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={()=>this.props.navigation.navigate('MyServicesView')}
								style={{justifyContent:'center', backgroundColor: '#FFDBB9'}}>
								<Image 
									source={images.angel_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Ver mis servicios
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
export default connect(mapStateToProps)(HomeUser)

const styles = StyleSheet.create({

});