import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native'
import { Container, Header, Content, Left, List, ListItem, Thumbnail, Text, Body, Input, Item, Label, Card, CardItem
 } from 'native-base'
import Ripple from 'react-native-material-ripple';
import images from '../../../assets/images'
import userActions from '../../actions/usersActions'

class NewsView extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      fundInfo: null,
      fetching: false
    }
    this.renderPics = this.renderPics.bind(this)
  } 

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: params.news.title
    }
  }

  componentDidMount() {
    this.setState({fetching:true})
    let news = this.props.navigation.state.params.news
    let imgs = news.imageUrls
    // console.log('news', news)

    userActions.fetchByUID(news.idFundacion).then((val)=>{
      this.setState({fundInfo: val, fetching:false})
    })
    // console.log("IMGS", imgs)
  }
  
  renderPics({item, index}) {
    let news = this.props.navigation.state.params.news
    let imgs = news.imageUrls
    let img = imgs[item].url
    // console.log("IMG: ", img)
		return(
      <View style={styles.picContent}>
        <Image source={{uri: img}} resizeMode='contain' style={{height: 300, width: 300, flex: 1}}/>
      </View>
		)
  }

  render() {
    let news = this.props.navigation.state.params.news
    let imgs = news.imageUrls
    if(this.state.fetching){
      return(
        <View style={{ flex:1, justifyContent: 'center' }} >
          <ActivityIndicator size='large' />
        </View>
      )
    }else{
      return (
        <ScrollView style={{flex:1}}>
          <CardItem>
            <Left>
              <Body>
                <View style={styles.container}>
                  <FlatList data={Object.keys(imgs)}
                    horizontal
                    bounces={true}
                    renderItem={this.renderPics}
                    keyExtractor={ (item, index) => {return `${index}` } }/>
                </View>
                
                <Text style={styles.titleField}>{news.title}</Text>
                <Text note style={{textAlign:'justify', marginTop:5}}>{news.date}</Text>
                <Text style={{textAlign:'justify', minHeight:50, marginTop:5}}>{news.description}</Text>
              </Body>
            </Left>
          </CardItem>

          <ListItem itemDivider>
            <Left><Text style={styles.dividerText}>Autor</Text></Left>
          </ListItem> 
          {this.state.fundInfo&&
          <Ripple onPress={()=>this.props.navigation.navigate('FoundationProfile', { foundationID:  news.idFundacion})}>
            <CardItem>
              <Left>
                <Thumbnail source={{ uri: this.state.fundInfo.photoUrl}} />
                <Body>
                  <Text>{this.state.fundInfo.name}</Text>
                  <Text note>{this.state.fundInfo.email}</Text>
                </Body>
              </Left>
            </CardItem>
          </Ripple>
          }
        </ScrollView>
      );
    }
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(NewsView)

const styles = StyleSheet.create({
  infoContainer: {
		flexDirection:'column',
		justifyContent:'center',
    alignItems: 'center',
    marginBottom: 10
  },
  infoField: {
		textAlign:'justify', 
    width: '80%',
    margin: 10
  },
  titleField:{ 
    textAlign:'center', 
    fontSize: 25,
    margin: 10,
    fontWeight: 'bold',
    color: '#2a2a2a'
  },
	picContent: {
		flex: 1,
    width: '100%',
		flexDirection: 'column',
		justifyContent:'center',
		alignItems: 'center'
  },
  container: {
    flex: 0.4,
    alignItems:'center', 
	},
});
