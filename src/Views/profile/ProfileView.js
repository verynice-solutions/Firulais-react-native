import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native'
import {connect} from 'react-redux'
//Style
import { Button, Icon,Thumbnail,Text,Item, Input} from 'native-base'

import Colors from '../../utils/colors'
import { updateUserProfile,getUserProfile} from '../../firebase/functions'
import { scale } from '../../lib/responsive';
import Divider from '../../Components/Divider'
import firebase from 'firebase'

class ProfileView extends Component {
	constructor(props) {
		super(props);
		this.state ={
			description:''
		}
	}
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Editar perfil',
			headerRight: (
			<Button transparent onPress={params.saveProfile}>
				<Text primary>Guardar</Text>
			</Button>)
    }
	}
	componentWillMount() {
		this.props.navigation.setParams({ saveProfile: this._saveProfile })

		let {uid} = this.props.currentUser
		firebase.database().ref('users/' + uid + '/profile').on('value', (snapshot)=>{
			var exist = snapshot.val()
			this.setState(exist)
		})
	}
	
	_saveProfile = () => {
		updateUserProfile(this.props.currentUser.uid,{
			description: this.state.description
		})
		
		Alert.alert('Profile saved successfully')
  };
	render() {
		let {user} = this.props.currentUser
		// console.log('USER PROFILE',this.state)
		return (
			<View style={{flex:1}}>
				<View style={{marginTop:40}}/>
				<View style={{ flexDirection:'column'}}>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Thumbnail square large source={{uri:user.photoUrl}}/>
					</View>
					<View style={{marginTop:10}}/>
					<View style={{flexDirection:'column',justifyContent:'space-around'}}>
						<Text style={{textAlign:'center'}}> 
							{user.name}
						</Text>
						<View style={{marginTop:10}}/>
						{/* <TextInput style={styles.textBox}
							autoCapitalize='none'
							autoCorrect={false}
							value={this.state.email}
							keyboardType='email-address'
							onChangeText={(text)=> this.setState({email: text})}
						/>
						 */}
						{/* <Text style={{paddingTop:5,textAlign:'center',color:Colors.greyishBrown}}> 
							{user.description}
						</Text> */}
						<Text>  Info:</Text>
						<Item regular>
							<Input placeholder='Descripción...'
							autoCorrect={true}
							value={this.state.description}
							onChangeText={(text)=> this.setState({description: text})} 
							/>
						</Item>
						<View style={{marginTop:40}}/>
						<View style={{flexDirection:'row',justifyContent:'center'}}>
							<Button bordered onPress={this._saveProfile}>
								<Text primary>Guardar</Text>
							</Button>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(ProfileView)

const styles = StyleSheet.create({

});