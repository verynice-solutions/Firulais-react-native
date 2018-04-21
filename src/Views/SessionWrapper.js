import React, { Component } from 'react';
import { connect } from 'react-redux'

import { SignedOutRoutes, SignedInRoutes } from '../routes/routes'


class SessionWrapper extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    // here Trigger cache fetching

  }                                                                                                 
  
  render() {
    // Handle user auth_token 
    let welcomeContainer = null
    
    if (this.props.currentUser.token) {
      welcomeContainer = <SignedInRoutes/>
    } else {
      welcomeContainer = <SignedOutRoutes/>
    }
    return (welcomeContainer)
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps)(SessionWrapper)
