import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'
import NavigationService from '../../routes/NavigationService'
//Style
import {Container,Content,Header,Left, Right,Title ,Button,Text, Icon,Thumbnail} from 'native-base'
import { scale } from '../../lib/responsive';
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'

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
					<View style={{marginTop:40}}/>
					<Text style={{textAlign:'center'}}> 
						FUNDATION HOME
					</Text>
					<View style={{marginTop:40}}/>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Button bordered onPress={this._goToaddPet}>
							<Text primary>Añadir mascota</Text>
						</Button>
					</View>
					<View style={{marginTop:40}}/>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Button bordered onPress={this._goToaddPet}>
							<Text primary>Ver Solicitudes</Text>
						</Button>
					</View>
					<View style={{marginTop:40}}/>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Button bordered onPress={this._goToaddNew}>
							<Text primary>Añadir Noticia/Evento</Text>
						</Button>
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