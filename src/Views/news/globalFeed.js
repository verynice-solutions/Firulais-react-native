import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';

import foundationsActions from '../../actions/foundationsActions'
import usersActions from '../../actions/usersActions'

class GlobalFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      news: []
    }
  }

  componentWillMount() {
    usersActions.fetchNNews(10).then((val)=>{
      this.setState({news: val})
    })
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Global Feed'
    }
	}

  render() {
    const { navigate } = this.props.navigation
    let news = this.state.news
    return (
      <View style={{flex:1}}>
        <ScrollView>
         <List>
          {
            news ?(
              Object.keys(news).map((i)=>{
                let imgs = news[i].imageUrls
                return <ListItem key={i} onPress={ ()=> navigate('NewsView', { news: news[i] }) }>
                  <Thumbnail rounded size={80} source={{ uri: imgs[Object.keys(imgs)[0]].url }} />
                  <Body>
                    <Text>{news[i].title}</Text>
                    <Text note> { news[i].description  } </Text>
                  </Body>
                </ListItem>
              })
            ):(
              <Text style={{margin:10}}> No News :( </Text>
            )
          }
          </List>
        </ScrollView>
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