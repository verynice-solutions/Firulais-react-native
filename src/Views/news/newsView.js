import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Input, Item, Label } from 'native-base';

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
			<TouchableOpacity onPress={()=> console.log("")}>
        <View style={styles.picContent}>
          <Thumbnail circle large source={{ uri: img}}/> 
        </View>
			</TouchableOpacity>
		)
  }

  render() {
    let news = this.props.navigation.state.params.news
    let imgs = news.imageUrls

    return (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <FlatList data={Object.keys(imgs)}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={true}
            renderItem={this.renderPics}
            keyExtractor={ (item, index) => {return `${index}` } }
          />
        </View>
        <View style={styles.infoContainer}>
          <Item>
            <Text style={styles.titleField}> {news.title} </Text>
          </Item>
          <Item>
            <Text style={styles.infoField}> {news.description} </Text>
          </Item>
          <Text style={styles.infoField}>{news.date}</Text>
        </View>
      
      </View>
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
		textAlign:'center', 
    width: '80%',
    margin: 10
  },
  titleField:{ 
    textAlign:'center', 
    fontSize: 25,
    margin: 10
  },
	picContent: {
		flex: 1,
    width: '100%',
    padding: 10,
		flexDirection: 'column',
		justifyContent:'center',
		alignItems: 'center'
  },
  container: {
    flex: 0.3,
    alignItems:'center', 
		paddingVertical: 5  
	},
});

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(NewsView)