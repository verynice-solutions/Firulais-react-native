import React, { Component } from 'react'
import firebase from '../../firebase/firebaseSingleton'
import {Item,Input,Label,Toast,Button} from 'native-base'
import { StyleSheet, Text, View, Alert} from 'react-native'
import Colors from '../../utils/Colors'
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
			Toast.show({
				text:'Las contraseñas deben ser iguales',
				buttonText:'Ok',
				duration: 3000,
				type:'danger'
			})
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
				<Item rounded>
				<Input
					placeholder='e-mail'
					autoCapitalize='none'
					autoCorrect={false}
					keyboardType='email-address'
					autoCorrect={false}
					value={this.state.email}
					onChangeText={(text)=> this.setState({email: text})}
				/>
				</Item>
				<Item rounded>
					<Input
						placeholder='contraseña'
						autoCapitalize='none'
						autoCorrect={false}
						secureTextEntry
						value={this.state.password}
						onChangeText={(text)=> this.setState({password: text})}
					/>
				</Item>
				<Item rounded>
					<Input
						placeholder='repita contraseña'
						autoCapitalize='none'
						autoCorrect={false}
						secureTextEntry
						value={this.state.passwordConfirm}
						onChangeText={(text)=> this.setState({passwordConfirm: text})}
					/>
				</Item>
				{/* <Button title='Crear cuenta' onPress={this.onSignIn}/>
				<Button title='volver' color={Colors.grey} onPress={()=>this.props.navigation.goBack()}/> */}
			</View>
		)
	}
}
const styles = StyleSheet.create({
  textBox: {
		paddingHorizontal:80
	},
	text: {
    fontFamily:'Roboto-Bold',
    fontSize: 16,
    textAlign: 'center'
  },
});

export default (SignUp)