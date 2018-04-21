import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

//Redux libs
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import getInitialState from './src/store/initialState' 
//Screens
import SessionWrapper from './src/Views/SessionWrapper'

const store = configureStore(getInitialState())

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SessionWrapper/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
