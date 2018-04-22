import React, { Component } from 'react'

import { StyleSheet, Text, View, TextInput, Button} from 'react-native'
import Colors from '../../utils/colors'

class ForgotPass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
		}
	}
	onSendRecuperacion= () => {
		
	}

	render() {
		return (
			<View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
				<Text style={styles.text}> FORGOT PASSWORD </Text>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					keyboardType='email-address'
					value={this.state.email}
					onChangeText={(text)=> this.setState({email: text})}
				/>
				<Button title='enviar correo de recuperación' onPress={this.onSendRecuperacion}/>
				<Button title='volver' color={Colors.grey} onPress={()=>this.props.navigation.goBack()}/>
			</View>
		)
	}
}
export default (ForgotPass)

const styles = StyleSheet.create({
  textBox: {
		width:200,
		height:40,
		borderWidth:1
	},
	text: {
    fontFamily:'Roboto-Bold',
    fontSize: 16,
    textAlign: 'center'
  },
});

