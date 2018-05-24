import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'
import foundationsActions from '../../actions/foundationsActions'
import usersActions from '../../actions/usersActions'
import images from '../../../assets/images'
class GlobalFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      news: null
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
      title: 'Noticias',
      tabBarIcon: <Ionicons size={26} name='md-globe'/>
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
                    <Text numberOfLines={2} note > { news[i].description  } </Text>
                  </Body>
                </ListItem>
              })
            ):(
              <View style={{paddingTop:100, paddingHorizontal:30,justifyContent:'center',alignItems:'center'}}>
                  <Image source={images.sherlock_kitty} resizeMode= 'contain' 
                    style={{height: 180, width: 180}}/>
                  <Text style={{fontStyle:'italic',fontFamily:'Roboto-Bold', textAlign:'center',lineHeight:30, fontSize:18,marginTop:18}}>Me pregunto dónde estarán mis noticias, querido Watson.</Text>
              </View>
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