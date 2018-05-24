import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'
import foundationsActions from '../../actions/foundationsActions'
import images from '../../../assets/images'

class PersonalFeed extends Component {
	constructor(props) {
    super(props)
    this.state = {
      feedNews: null
    }
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
      title: 'Mis Noticias',
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
    // console.log('allNews: ',allNews)
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
                        <Text note numberOfLines={2}> { news[i].description  } </Text>
                      </Body>
                    </ListItem>
                  })
                )
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
    )
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(PersonalFeed)