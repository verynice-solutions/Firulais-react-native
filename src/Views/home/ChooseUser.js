import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import {connect} from 'react-redux'
import sessionActions from '../../actions/sessionActions'
//Style
import {Container, Content, Button, Text, Card, CardItem, Body, Header, Left, Title, Right} from 'native-base'
import images from '../../../assets/images'

class ChooseUser extends Component {
	constructor(props) {
		super(props);
		this._saveUserType=this._saveUserType.bind(this)
		this._confirmTypeOfUser=this._confirmTypeOfUser.bind(this)
  }
  _saveUserType(type){
		let {currentUser} = this.props
		this.props.updateUserType(currentUser,type)
		this.props.navigation.navigate('EditProfile')
	}

	_confirmTypeOfUser(type){
		if(type=='fundation'){
			Alert.alert(
				`Quiero ser Fundación`,
				`¿Estas segur@ que quieres tener el rol de fundación rescatista de animales dentro de Firulais?`,
				[
					{text: 'NO', onPress: () => null, style: 'cancel'},
					{text: 'SIP', onPress: () => this._saveUserType(type)},
				],
				{ cancelable: false }
			)
		}else{
			this._saveUserType(type)
		}
	}

	render() {
		return (
			<Container>
				<Content>
					
					<Text style={styles.textDefault}>¿Qué tipo de usuario te gustaría ser?</Text>
					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button
								onPress={()=>this._confirmTypeOfUser('fundation')} 
								style={{justifyContent:'center', backgroundColor: '#B7CFFF'}}>
								<Image 
									source={images.super_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Fundación
								</Text>	
							</CardItem>
						</Card>						
					</View>

					<View style={{flexDirection:'row',justifyContent:'center', marginLeft: 10, marginRight: 10}}>
						<Card>
							<CardItem 
								button 
								onPress={()=>this._saveUserType('user')}
								style={{justifyContent:'center', backgroundColor: '#DDD9FC'}}>
								<Image 
									source={images.inlove_kitty} resizeMode= 'contain' 
									style={{height: 100, width: null, marginTop: 10, flex: 1}}/>
							</CardItem>
							<CardItem					
								style={{justifyContent:'center'}}>
								<Text 
									primary 
									style={{fontWeight: 'bold', textAlign: 'center'}}>
									Voluntario
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
export default connect(mapStateToProps,{
	updateUserType: sessionActions.updateUserType
})(ChooseUser)

const styles = StyleSheet.create({
	textDefault:{ 
		textAlign:'center',
		marginTop: 10,
		marginBottom: 10
	}
});