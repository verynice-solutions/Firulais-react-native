import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import foundationsActions from '../../actions/foundationsActions'

class ServicesView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allServices: []
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Servicios'
    }
	}
    
  componentWillMount() {
    foundationsActions.fetchAllServices(this.props.currentUser.uid).then( (val) =>{
      // console.log("RESPONSE", val)
      this.setState({allServices: val})
    })
  }

	render() {
    let services = this.state.allServices
    return (
      <View style={{flex:1}}> 
        <List>
          {
            services ?(
              Object.keys(services).map((i)=>{
                return <ListItem key={i}>
                    <Body>
                      <Text>{services[i].petId}</Text>
                    </Body>
                  </ListItem>
              })
            ):(
              <Text>No Servicios :( </Text>
            )
          }
          </List>
      </View>
    )
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(ServicesView)

const styles = StyleSheet.create({

});