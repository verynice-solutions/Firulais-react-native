import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import usersActions from '../../actions/usersActions'

class UsersView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allUsers: []
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Personas'
    }
	}
    
  componentWillMount() {
    usersActions.fetchAllUsers().then( (val) =>{
      //console.log("RESPONSE", val)
      this.setState({allUsers: val})
    })
  }

	render() {
    let users = this.state.allUsers
    const { navigate } = this.props.navigation

    return (
      <View style={{flex:1}}>
        <ScrollView> 
          <List>
            {
              users!==undefined ?(
                Object.keys(users).map((i)=>{
                  let profile = users[i].profile             
                  return <ListItem key={i} onPress={ ()=> navigate('UserProfile', { userID: i }) }>
                    <Thumbnail rounded size={80} source={{ uri: users[i].photoUrl }} />
                    <Body>
                      <Text>{users[i].name}</Text>
                      <Text note>{ profile && profile.description  } </Text>
                    </Body>
                  </ListItem>
                })
              ):(
                <Text>No Personas :( </Text>
              )
            }
            </List>
          </ScrollView>
      </View>
    )
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(UsersView)

const styles = StyleSheet.create({
 
});