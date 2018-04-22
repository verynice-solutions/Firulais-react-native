import React from 'react';

//Redux libs
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import getInitialState from './src/store/initialState' 
//Screens
import SessionWrapper from './src/Views/SessionWrapper'


const store = configureStore(getInitialState())

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <SessionWrapper/>
      </Provider>
    );
  }
}
