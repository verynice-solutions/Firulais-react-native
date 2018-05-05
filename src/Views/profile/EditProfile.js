import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity,Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
//Style
import { Button, Icon,Thumbnail,Text,Item, Input} from 'native-base'
import firebase from '../../firebase/firebaseSingleton'

class EditProfileView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description:'',
			fetching: true
		}
		this.profiles_fire_reference=firebase.database().ref('users/' + this.props.currentUser.uid + '/profile')
		this._fetch_profile=this._fetch_profile.bind(this)
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

	componentDidMount() {
		this.props.navigation.setParams({ saveProfile: this._saveProfile })
		this._fetch_profile()
	}

	_fetch_profile(){
		this.setState({fetching:true})
		
		this.profiles_fire_reference.once('value')
		.then( (res)=>{
			this.setState({ ...res.val() ,fetching: false })
		})
	}

	_saveProfile = () => {
		this.profiles_fire_reference.update({...this.state})
		.then(() => {
			Alert.alert('Profile saved successfully')
		})
		.catch(() => {
			Alert.alert('Sorry, your profile could not be saved')
			this._fetch_profile()
		})	
	}
	
	render() {
		let {user} = this.props.currentUser
		// console.log('USER PROFILE',this.state)
		if(this.state.fetching){
			return (
				<View style={{flex:1,justifyContent:'center'}}> 
					<ActivityIndicator size="large" /> 
				</View>
			)
		}else{
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
								{/* <Button bordered onPress={this._saveProfile}>
								<Text primary>Guardar</Text>
								</Button> */}
						</View>
					</View>
				</View>
			</View>
		)
	}
}
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(EditProfileView)

const styles = StyleSheet.create({

});