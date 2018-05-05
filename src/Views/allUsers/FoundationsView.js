import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Text } from 'native-base'

import foundationsActions from '../../actions/foundationsActions'

class FoundationsView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allFoundations: []
    }
  }
    
  componentDidMount() {
    foundationsActions.fetchAllFoundations().then((val)=>{
      console.log("DUDEEEEE: ", val)
      this.setState({allFoundations: val})
    })
  }

	render() {
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
export default connect(mapStateToProps)(FoundationsView)

const styles = StyleSheet.create({

});