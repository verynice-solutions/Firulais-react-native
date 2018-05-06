import React, { Component } from 'react'
import { StyleSheet, View, TextInput, Alert, ActivityIndicator,Image, Dimensions} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {Google,Constants} from 'expo'
import {connect} from 'react-redux'
import { Button, Text, Toast,Icon } from 'native-base'
import firebase from '../../firebase/firebaseSingleton'


import Images from '../../../assets/images'
import {scale, scaleModerate, scaleVertical} from '../../lib/responsive'
import {updateUserDB} from '../../firebase/functions'
import OAuth from '../../config/OAuth'
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
class LogInView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			fetching:false,
			showToast: false,
		}
	}

	onLogin= () => {
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
			.then( (result)=>{
				// ToDo: WE COULD DO A BUNCH OF STUFF WITH RESULT(eMail Verified): check out object
				// console.log('RESULT MANUAL LOGIN:',result)
				this.props.storeCurrentUser({ user: result })
			},(error) => {
				Alert.alert(error.message)
			});
	}
	onLoginWithGoogle = () => {
		setTimeout(() => {
			this.setState({fetching:true})
			signInWithGoogleAsync().then( (userCredentials)=>{
				if(!userCredentials.error){
				let credential = firebase.auth.GoogleAuthProvider.credential(
					userCredentials.idToken , userCredentials.accessToken)
				// Sign in in Firebase
				firebase.auth().signInWithCredential(credential)
					.then( (result)=>{
						//Refresh or Add user in DB
						this.props.updateUserDB(result.uid,{
							...userCredentials.user,
						})
						setTimeout(() => {
							Toast.show({
								text:'Inicio de sessión exitoso!',
								buttonText:'OK',
								duration: 6000,
								type:'success'
							})
						}, 1000);
					},(error) => {
						Alert.alert(error.message)
					})
				}
			}).catch((error) => {
				// no log-in </3
				Toast.show({
					text:'Inicio de sessión cancelado',
					buttonText:'OK',
					duration: 6000,
					type:'danger'
				})
				this.setState({fetching:false})
			})
		}, 1000);
	}
	
	render() {
		// console.log('USER:',this.props.currentUser)
		if(this.state.fetching){
			return (
				<View style={{flex:1,justifyContent:'center'}}> 
					<ActivityIndicator size="large" /> 
				</View>
			)
		}else{
			return (
				<View style={{flex:1, flexDirection:'column', alignItems:'center', backgroundColor:'white'}}>

					<View style={{ height: Constants.statusBarHeight, width:Dimensions.get('window').width,  backgroundColor:'#6c46b3'}}/>

					<Image style={{width:Dimensions.get('window').width}} source={Images.login_hero}/>
					<View style={{marginTop:40}}/>
					<View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
						<Button onPress={this.onLoginWithGoogle} rounded danger >
							<Icon name="logo-google" />
							<Text> Google + </Text>
						</Button>
						<View style={{marginTop:40}}/>
						{/* <TextInput style={styles.textBox}
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
						<Button title='¡ oh no !' color={Colors.grey} onPress={()=>this.props.navigation.navigate('Forgot')}/> */}
					</View>
				</View>
			)
		}
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
	setCurrentUser: sessionActions.setCurrentUser,
	updateUserDB: sessionActions.updateUserDB,
	storeCurrentUser: sessionActions.storeCurrentUser
})(LogInView)