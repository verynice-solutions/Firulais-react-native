import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground } from 'react-native'
import { Container, Header, Content, Left, List, ListItem, Thumbnail, Text, Body, Input, Item, Label, Card, CardItem
 } from 'native-base';
 import images from '../../../assets/images'

class NewsView extends React.Component {
  
  constructor(props) {
    super(props)
    this.renderPics = this.renderPics.bind(this)
  } 

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: params.news.title
    }
  }

  componentWillMount() {
    let news = this.props.navigation.state.params.news
    let imgs = news.imageUrls
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

    return (
      <ScrollView style={{flex:1}}>

        <CardItem>
          <Left>
            <Body>
              <View style={styles.container}>
                <FlatList data={Object.keys(imgs)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
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
        <CardItem>
          <Left>
            <Thumbnail source={images.login_hero} />
            <Body>
              <Text>NativeBase</Text>
              <Text note>GeekyAnts</Text>
            </Body>
          </Left>
        </CardItem>




      </ScrollView>
    );
  }
}


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

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(NewsView)