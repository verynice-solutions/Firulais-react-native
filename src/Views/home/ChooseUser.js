import React, { Component } from 'react'

import { Platform, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'
import sessionActions from '../../actions/sessionActions'
//Style
import {Container,Content,Button,Text} from 'native-base'

class ChooseUser extends Component {
	constructor(props) {
		super(props);
		this._saveUserType=this._saveUserType.bind(this)
  }
  _saveUserType(type){
		let {currentUser} = this.props
		this.props.updateUserType(currentUser,type)
	}

	render() {
		return (
			<Container>
				<Content>
					<View style={{marginTop:40}}/>
					<Text style={styles.textDefault}> 
						¿Qué tipo de usuario te gustaría ser?
					</Text>
					<View style={{marginTop:40}}/>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Button rounded onPress={()=>this._saveUserType('user')} primary>
							<Text style={styles.textDefault}> Voluntario </Text>
						</Button>
					</View>
					<View style={{marginTop:20}}/>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Button rounded onPress={()=>this._saveUserType('fundation')} primary>
							<Text style={styles.textDefault} > Fundación </Text>
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
export default connect(mapStateToProps,{
	updateUserType: sessionActions.updateUserType
})(ChooseUser)

const styles = StyleSheet.create({
	textDefault:{
		fontFamily:'Roboto-Bold', 
		textAlign:'center'
	}
});