import React from 'react';
import {View,Platform, StatusBar} from 'react-native'
import {Root} from 'native-base'
//Screens
import SessionWrapper from './src/Views/SessionWrapper'
import Colors from './src/utils/colors'
//Yellow box warnings
import { YellowBox } from 'react-native';
import _ from 'lodash';
//Redux libs
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import getInitialState from './src/store/initialState' 
const store = configureStore(getInitialState())

export default class App extends React.Component {
  constructor(props){
    super(props)
    // YellowBox.ignoreWarnings(['Setting a timer']);
    // const _console = _.clone(console);
    // console.warn = message => {
    //   if (message.indexOf('Setting a timer') <= -1) {
    //     _console.warn(message);
    //   }
    // };
  }
  
  render() {
    return (
      <Provider store={store}>
        <Root style={{flex:1}}>
          {/* {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <StatusBar barStyle='light-content' backgroundColor='black'/>} */}
          <StatusBar barStyle='default'/>
            <SessionWrapper/>
        </Root>
      </Provider>
    );
  }
}
