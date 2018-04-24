import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native'
import Colors from '../../utils/colors'
import {Google} from 'expo'
import firebase from 'firebase'
import {connect} from 'react-redux'
import {scale} from '../../lib/responsive'

import OAuth from '../../config/OAuth'
import requestActions from '../../config/requestActions'
import sessionActions from '../../actions/sessionActions'

async function signInWithGoogleAsync() {
	try {
		const result = await Google.logInAsync(OAuth.options);
		
		if (result.type === 'success') {
			return result;
		} else {
			return {cancelled: true};
		}
	} catch(e) {

		return {error: true};
	}
}
// Alert.alert(result.accessToken)
// Alert.alert('Google Sync Error');
class LogInView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
		}
		this._getGoogleProfileInfo = this._getGoogleProfileInfo.bind(this)
	}
	_getGoogleProfileInfo(params = { onSuccess: (response)=>{} }, userCredentials) {
    let { request,} = this.props // currentUser 
    request(
      {
        method: 'GET',
				path: `https://www.googleapis.com/oauth2/v1/userinfo?`,
        params: {
					fields:['email','family_name','gender','given_name','hd','id','link','locale','name','picture','verified_email'],
          access_token: userCredentials.accessToken,
        },
        beforeRequestStart: () => {
          this.setState({ isFetching: true })
        },
        onSuccess: (response)=>{
					// console.log('Google profile info response',response)
					
					this.props.setCurrentUser({
						token: userCredentials.accessToken,id_token: userCredentials.idToken, signInData: response.data
					})
          this.setState({
            isFetching: false
          })
        },
        onError: (response) => {
          console.log(response)
        }
      }
    )
  }
	onLogin= () => {
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
			.then( (result)=>{
				// ToDo: WE COULD DO A BUNCH OF STUFF WITH RESULT(eMail Verified): check out object
				// console.log('RESULT MANUAL LOGIN:',result)
				this.props.setCurrentUser({user:{result}})
			},(error) => {
				Alert.alert(error.message)
			});
	}
	onLoginWithGoogle = () => {
		signInWithGoogleAsync().then( (userCredentials)=>{
			if(!userCredentials.error){
			let credential = firebase.auth.GoogleAuthProvider.credential(
				userCredentials.idToken , userCredentials.accessToken)
			// Sign in in Firebase
			firebase.auth().signInWithCredential(credential)
				.then( (result)=>{
					this.props.setCurrentUser(JSON.parse(JSON.stringify(userCredentials)))
				},(error) => {
					Alert.alert(error.message)
				});
			}
		},(error)=>{
			Alert.alert(error.message)
		})
		
	}
	render() {
		console.log('USER:',this.props.currentUser)
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
				<Button title='¡ oh no !' color={Colors.grey} onPress={()=>this.props.navigation.navigate('Forgot')}/>
				<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
					<Button title='Do it with Google..' color={Colors.purple} onPress={this.onLoginWithGoogle}/>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
  textBox: {
		width:scale(200),
		height:scale(40),
		borderWidth:1
	},
	text: {
    fontFamily:'Roboto-Bold',
    fontSize: 16,
    textAlign: 'center'
	},
	buttonStyle:{
		padding:scale(10)
	}
});
function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps, {
	request: requestActions.request,
	setCurrentUser: sessionActions.setCurrentUser,
})(LogInView)