import React, { Component } from 'react'

import { Platform,	View, StyleSheet, Image, TouchableOpacity,Alert, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'
import foundationsActions from '../../../actions/foundationsActions'
//Style
import { Button, Icon,Thumbnail,Text,Item, Input} from 'native-base'
import firebase from '../../../firebase/firebaseSingleton'

class UsersProfile extends Component {
	constructor(props) {
		super(props);
		this.state={
			data: []
		}
	}

	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Perfil'
    }
	}

	componentWillMount() {
		let params = this.props.navigation.state.params
		let stuff = foundationsActions.fetchByUID(params.userID).then((val)=>{
			this.setState({data: val})
		})
	}

	render() {
		let info = this.state.data
		let profile = info.profile
		return (
			<View style={{flex:1}}>
				<View style={{ flexDirection:'column'}}>
					{
						info ?(
							<View>
								<View style={styles.thumbContainer}>
									<Thumbnail circle large source={{ uri: info.photoUrl }}/>
									<Text style={styles.nameField}> 
										{info.name}
									</Text>
								</View>

								<View style={styles.infoContainer}>
									<Text style={styles.infoField}> {profile && profile.description  }  </Text>
								</View>
							</View>
						):(
							<View style={styles.infoContainer}>
									<Text style={styles.infoField}>
										Nobody here :(
									</Text>
							</View>
						)
					}

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
export default connect(mapStateToProps)(UsersProfile)

const styles = StyleSheet.create({
	thumbContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10
	},
	infoContainer: {
		flexDirection:'column',
		justifyContent:'center',
		alignItems: 'center'
	},
	nameField: {
		textAlign:'center',
		marginTop: 5
	},
	infoField: {
		textAlign:'center', 
		width:'80%'
	}

});