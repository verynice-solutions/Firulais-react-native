import React, { Component } from 'react'
import firebase from 'firebase'
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native'
import Colors from '../../utils/colors'
//Redux
import {} from '../../actions/sessionActions'
class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			passwordConfirm:''
		}
	}
	onSignIn= () => {
		if(this.state.password !== this.state.passwordConfirm){
			Alert.alert('Las contraseñas deben ser iguales')
		}
		firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
			.then(() => {
				
			},(error) => {
				Alert.alert(error.message)
			})
	}

	render() {
		return (
			<View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
				<Text style={styles.text}> SIGN IN VIEW </Text>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					keyboardType='email-address'
					autoCorrect={false}
					value={this.state.email}
					onChangeText={(text)=> this.setState({email: text})}
				/>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry
					value={this.state.password}
					onChangeText={(text)=> this.setState({password: text})}
				/>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry
					value={this.state.passwordConfirm}
					onChangeText={(text)=> this.setState({passwordConfirm: text})}
				/>
				<Button title='Crear cuenta' onPress={this.onSignIn}/>
				<Button title='volver' color={Colors.grey} onPress={()=>this.props.navigation.goBack()}/>
			</View>
		)
	}
}
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

export default (SignUp)