import React, { Component } from 'react'

import { Platform,	Text,	View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'

//Style
import {Header,Left, Right,Title ,Button, Icon,Thumbnail} from 'native-base'
import { scale } from '../../lib/responsive';
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'

class HomeUser extends Component {
	constructor(props) {
		super(props);
  }
  
	render() {
		let {user} = this.props.currentUser
		// console.log('Current user:',this.props.currentUser)
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				<Text style={{textAlign:'center'}}> 
					USER HOME
				</Text>
			</View>
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