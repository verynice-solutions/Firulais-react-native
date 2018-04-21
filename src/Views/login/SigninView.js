import React, { Component } from 'react'

import {
	Platform,
	Text,
	View
} from 'react-native'

class SigninView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{flex:1, justifyContent:'center'}}>
				<Text style={{textAlign:'center'}}> SIGN IN VIEW </Text>
			</View>
		)
	}
}

export default (SigninView)