import React, { Component } from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, Image,ActivityIndicator } from 'react-native'
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'
import foundationsActions from '../../actions/foundationsActions'
import images from '../../../assets/images'

class PersonalFeed extends Component {
	constructor(props) {
    super(props)
    this.state = {
      feedNews: null,
      fetching: false
    }
  }

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    // console.log('params',params)
    let label = params.usertype=='user'?'SUBSCRITAS':'MIS NOTICIAS';
		return{
      title: 'Noticias',
      tabBarLabel: label,
      tabBarIcon: <Ionicons name='md-ribbon' size={26} />
    }
	}
    
  componentDidMount() {
    
    
    this.setState({fetching: true})
    let user = this.props.currentUser
    this.props.navigation.setParams({ usertype: user.type })
    if(user.type=='user'){
      foundationsActions.fetchAllUserFoundations(this.props.currentUser.uid).then( (val) =>{
        // this.setState({allFoundations: val})
        // console.log('val',val)
        if(val){
          let promises = []
          Object.keys(val).map((item, index)=>{
            // console.log('item',item)
            promises.push(foundationsActions.fetchFoundationNews(item))
          })
          Promise.all(promises).then((values) => { 
            // console.log("IDIDIT: ", values)
            if(values[0]){
              // console.log('si tiene values')
              this.setState({feedNews: values, fetching: false}) 
            }else{
              // console.log('No tiene values')
              this.setState({feedNews: null, fetching: false}) 
            }
  
          }).catch((error)=>{
            console.log('Error: '+ error)
          })
        }else{
          this.setState({feedNews: null, fetching: false}) 
        }
      })
    }else{
      foundationsActions.fetchFoundationNews(user.uid).then((values) => { 
        // console.log("IDIDIT: ", values)
        if(values){
          // console.log('si tiene values')
          this.setState({feedNews: [values], fetching: false}) 
        }else{
          // console.log('No tiene values')
          this.setState({feedNews: null, fetching: false}) 
        }
      })
    }
  }
 
	render() {
    let allNews = this.state.feedNews
    const { navigate } = this.props.navigation
    // console.log('allNews: ',allNews)
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
              allNews?(
                allNews.map((item)=>{  //Loop of different foundation's news
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
                    <Image source={images.pencil_kitty} resizeMode= 'contain' 
                      style={{height: 180, width: 180}}/>
                    <Text style={{fontStyle:'italic',fontFamily:'Roboto-Bold', textAlign:'center',lineHeight:30, fontSize:18,marginTop:18}}>
                      {this.props.currentUser.type=='user'?
                        'Subscribete a fundaciones para recibir sus noticias.'
                        :
                        'Crea noticias y aparecerán aquí para ti.'
                      }
                    </Text>
                </View>
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
export default connect(mapStateToProps)(PersonalFeed)