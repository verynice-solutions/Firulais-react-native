import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Text } from 'native-base'

class UsersView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
    console.log('USER PROFILE',this.state)
    return (
        <View style={{flex:1,justifyContent:'center'}}> 
          <Text>Something Users Views</Text>
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