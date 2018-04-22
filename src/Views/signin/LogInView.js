import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native'
import Colors from '../../utils/colors'
import firebase from 'firebase'

class LogInView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:''
		}
	}
	onLogin= () => {
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
			.then( ()=>{

			},(error) => {
				Alert.alert(error.message)
			});
	}

	render() {
		return (
			<View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
				<Text style={styles.text}> LOG IN VIEW </Text>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					value={this.state.email}
					keyboardType='email-address'
					onChangeText={(text)=> this.setState({email: text})}
				/>
				<TextInput style={styles.textBox}
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry
					value={this.state.password}
					onChangeText={(text)=> this.setState({password: text})}
				/>
				<Button title='Entrar' onPress={this.onLogin}/>
				<Button title='Crear cuenta' onPress={()=>this.props.navigation.navigate('SignUp')}/>
				<Button title='oh no! mi contraseña' color={Colors.grey} onPress={()=>this.props.navigation.navigate('Forgot')}/>
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

export default (LogInView)