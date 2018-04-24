import React, { Component } from 'react'

import { Platform,	Text,	View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'

//Style
import {Header,Left, Right,Title ,Button, Icon,Thumbnail} from 'native-base'
import { scale } from '../../lib/responsive';
import {randomPuppers} from '../../utils/random_functions'
import Divider from '../../Components/Divider'

class ProfileView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {user} = this.props.currentUser
		return (
			<View style={{flex:1}}>
				<Header span>
					<Left>
						<Button transparent onPress={()=>this.props.navigation.navigate('DrawerOpen')}>
							<Icon name='menu' />
						</Button>
					</Left>
				</Header>
				<View style={{ flexDirection:'column'}}>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Thumbnail square large source={{uri:user.photoUrl}}/>
					</View>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Text style={{textAlign:'center'}}> 
						</Text>
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