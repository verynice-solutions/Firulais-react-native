import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'
import foundationsActions from '../../actions/foundationsActions'


class PersonalFeed extends Component {
	constructor(props) {
    super(props)
    this.state = {
      feedNews: []
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
      title: 'Mis Fundaciones',
      tabBarIcon: <Ionicons name='md-ribbon' size={26} />
    }
	}
    
  componentWillMount() {
    foundationsActions.fetchAllUserFoundations(this.props.currentUser.uid).then( (val) =>{
      // this.setState({allFoundations: val})
      if(val){
        let promises = []
        Object.keys(val).map((item, index)=>{
          promises.push(foundationsActions.fetchFoundationNews(item))
        })
        Promise.all(promises).then((values) => { 
          // console.log("IDIDIT: ", values)
          this.setState({feedNews: values}) 
        });
      }
    })
  }
 
	render() {
    let allNews = this.state.feedNews
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}> 
        <ScrollView>
         <List>
          {
            allNews ? (
              allNews.map((item)=>{  //Loop of different foundation's news
                // console.log(allNews)
                let news = item
                return news && (
                  Object.keys(news).map((i)=>{  //Loop of specific set
                    let imgs = news[i].imageUrls
                    return <ListItem key={i} onPress={ ()=> navigate('NewsView', { news: news[i] }) }>
                      <Thumbnail rounded size={80} source={{ uri: imgs[Object.keys(imgs)[0]].url }} />
                      <Body>
                        <Text>{news[i].title}</Text>
                        <Text note> { news[i].description  } </Text>
                      </Body>
                    </ListItem>
                  })
                )
              })
            ):(
              <Text style={{margin:10}}> No News :( </Text>
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
export default connect(mapStateToProps)(PersonalFeed)