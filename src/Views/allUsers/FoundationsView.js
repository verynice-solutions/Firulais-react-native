import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import foundationsActions from '../../actions/foundationsActions'

class FoundationsView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allFoundations: [],
      fetching: true
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {}
		return{
			title: 'Fundaciones'
    }
	}
    
  componentWillMount() {
    this.setState({fetching:true})
    foundationsActions.fetchAllFoundations().then( (val) =>{
      //console.log("RESPONSE", val)
      this.setState({allFoundations: val, fetching:false})
    })
  }

	render() {
    let foundations = this.state.allFoundations
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
                foundations!==undefined ?(
                  Object.keys(foundations).map((i)=>{
                    let profile = foundations[i].profile             
                    return <ListItem key={i} onPress={ ()=> navigate('FoundationProfile', { foundationID: i }) }>
                        <Thumbnail rounded size={80} source={{ uri: foundations[i].photoUrl }} />
                        <Body>
                          <Text>{foundations[i].name}</Text>
                          <Text note>{profile && profile.description  } </Text>
                        </Body>
                      </ListItem>
                  })
                ):(
                  <Text>No hay Fundaciones :( </Text>
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
export default connect(mapStateToProps)(FoundationsView)

const styles = StyleSheet.create({

});