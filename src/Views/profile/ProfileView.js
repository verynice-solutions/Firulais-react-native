import React, { Component } from 'react'

import {
	Platform,
	Text,
	View
} from 'react-native'

class ProfileView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{flex:1, justifyContent:'center'}}>
				<Text style={{textAlign:'center'}}> PROFILE VIEW </Text>
			</View>
		)
	}
}

export default (ProfileView)