import React, { Component } from 'react'
import { StyleSheet, View, Alert, ActivityIndicator,Image, Dimensions, StatusBar, KeyboardAvoidingView,ScrollView} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {Google,Constants} from 'expo'
import {connect} from 'react-redux'
import { Text, Toast,Icon, Item, Input, Button } from 'native-base'
import firebase from '../../firebase/firebaseSingleton'
import Modal from 'react-native-modal'

import Images from '../../../assets/images'
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
			isModalVisible: false,
		}
	}

	onLogin= () => {
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
			.then( (result)=>{
				// ToDo: WE COULD DO A BUNCH OF STUFF WITH RESULT(eMail Verified): check out object
				// console.log('RESULT MANUAL LOGIN:',result)
				this.props.storeCurrentUser({ user: result })
			},(error) => {
				Toast.show({
					text:'Este medio es solo para cuentas autorizadas.',
					buttonText:'OK',
					duration: 3000,
					type:'success'
				})
				this._toggleModal()
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
								duration: 3000,
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
					duration: 3000,
					type:'danger'
				})
				this.setState({fetching:false})
			})
		}, 1000);
	}
	_toggleModal = () =>
	this.setState({ isModalVisible: !this.state.isModalVisible });
	
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
				<ScrollView contentContainerStyle={{alignItems:'center'}}  style={{flex:1, flexDirection:'column', backgroundColor:'white'}}>

					<StatusBar backgroundColor='#6c46b3' />

					<Image style={{width:Dimensions.get('window').width}} source={Images.login_hero}/>
					<View style={{marginTop:15}}/>
					<Text style={styles.titleText}>    Inicia sessión con    </Text>
					<View style={{marginTop:15}}/>
					<View style={{justifyContent:'center'}}>	
						<Button onPress={this.onLoginWithGoogle} rounded danger >
							<Icon name="logo-google" />
							<Text>Google +   </Text>
						</Button>
					</View>
					<View style={{marginTop:15}}/>
					<Text>    ó    </Text>
					<View style={{marginTop:15}}/>
					<View style={{justifyContent:'space-around'}}>	
						<Button light rounded onPress={()=>this._toggleModal()}>
							<Text> Cuenta Firulais </Text>
						</Button>
					</View>
					{this.state.isModalVisible&&<View style={{marginTop:25}}/>}
					{this.state.isModalVisible&&
						<Item rounded style={styles.textBox}>
							<Input
								placeholder='e-mail'
								autoCapitalize='none'
								autoCorrect={false}
								value={this.state.email}
								keyboardType='email-address'
								onChangeText={(text)=> this.setState({email: text})}
							/>
						</Item>}
					{this.state.isModalVisible&&	
						<Item rounded style={styles.textBox}>
							<Input 
								placeholder='contraseña'
								autoCapitalize='none'
								autoCorrect={false}
								secureTextEntry
								value={this.state.password}
								onChangeText={(text)=> this.setState({password: text})}
							/>
						</Item>}
					{this.state.isModalVisible&&
						<View style={{justifyContent:'space-around'}}>	
							<Button light rounded onPress={this.onLogin}>
								<Text>       Entrar       </Text>
							</Button>
						</View>}
					{/* <Button title='Crear cuenta' primary onPress={()=>this.props.navigation.navigate('SignUp')}>
					</Button>
					<Button title='¡ oh no !' primary onPress={()=>this.props.navigation.navigate('Forgot')}>
					</Button> */}
					<View style={{marginBottom:40}}/>
				</ScrollView>
			)
		}
	}
}
const styles = StyleSheet.create({
  textBox: {
		paddingHorizontal:25,
		marginBottom: 20,
		marginLeft: 55,
		marginRight: 55
	},
	titleText:{
		fontFamily:'Roboto-Bold',
		fontSize:16, 
		color:'#2A2A2A'
	},
	text: {
    fontFamily:'Roboto-Bold',
    fontSize: 16,
    textAlign: 'center'
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