import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import foundationsActions from '../../actions/foundationsActions'

class GlobalFeed extends React.Component {
  constructor(props) {
    super(props)
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Global'
    }
	}

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Global Feed</Text>
      </View>
    );
  }
}


function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(GlobalFeed)