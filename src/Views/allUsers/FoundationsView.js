import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Text } from 'native-base'

import foundationsActions from '../../actions/foundationsActions'

class FoundationsView extends Component {
	constructor(props) {
    super(props);
    
  }
    
  componentDidMount() {
      this.props.fetchFoundations()
  }

	render() {
    console.log('USER PROFILE',this.state)
    return (
      <View style={{flex:1,justifyContent:'center'}}> 
        <Text>Something Foundations Views</Text>
      </View>
    )
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps, {
    fetchFoundations: foundationsActions.fetchAllFoundations,
})(FoundationsView)

const styles = StyleSheet.create({

});