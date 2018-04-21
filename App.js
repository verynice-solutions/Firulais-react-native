import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
//Firebase
import ApiKeys from './src/firebase/ApiKeys'
//Redux libs
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import getInitialState from './src/store/initialState' 
//Screens
import SessionWrapper from './src/Views/SessionWrapper'
import * as firebase from 'firebase'

const store = configureStore(getInitialState())

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      isLoadingComplete:false,
    }
    //initialize Firebase....
    if(!firebase.apps.lenght){ 
      firebase.initializeApp(ApiKeys.FirebaseConfig)
      // console.log('Hello Firebase:',firebase.app().name)
    }
  }
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
