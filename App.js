import React from 'react';
import {View,Platform, StatusBar} from 'react-native'
//Redux libs
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import getInitialState from './src/store/initialState' 
//Screens
import SessionWrapper from './src/Views/SessionWrapper'

// STATUS BAR ANDROID maybe? style={{ height: 24, backgroundColor: 'rgba(0,0,0,0.2)'}} 
import Colors from './src/utils/colors'
const store = configureStore(getInitialState())

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          {/* {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <StatusBar barStyle='light-content' backgroundColor='black'/>} */}
          <StatusBar barStyle='default'/>
          <SessionWrapper/>
        </View>
      </Provider>
    );
  }
}
