import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import usersActions from '../../actions/usersActions'

class UsersView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allUsers: [],
      fetching: false
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Voluntarios'
    }
	}
    
  componentDidMount() {
    this.setState({fetching: true})
    usersActions.fetchAllUsers().then( (val) =>{
      //console.log("RESPONSE", val)
      this.setState({allUsers: val, fetching: false})
    })
  }

	render() {
    let users = this.state.allUsers
    const { navigate } = this.props.navigation
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else{
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
                  <Text>No hay Personas :( </Text>
                )
              }
              </List>
            </ScrollView>
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
export default connect(mapStateToProps)(UsersView)

const styles = StyleSheet.create({
 
});