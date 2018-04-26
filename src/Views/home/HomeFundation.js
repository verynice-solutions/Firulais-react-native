import React, { Component } from 'react'

import { Platform,	Text,	View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'

//Style
import {Header,Left, Right,Title ,Button, Icon,Thumbnail} from 'native-base'
import { scale } from '../../lib/responsive';
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'

class HomeFundation extends Component {
	constructor(props) {
		super(props);
  }
  
	render() {
		let {user} = this.props.currentUser
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				<Text style={{textAlign:'center'}}> 
					FUNDATION HOME
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
export default connect(mapStateToProps)(HomeFundation)

const styles = StyleSheet.create({

});