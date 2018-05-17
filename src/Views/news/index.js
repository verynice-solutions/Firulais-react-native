import React, { Component } from 'react'
import { TabNavigator } from 'react-navigation';
import GlobalFeed from './globalFeed'
import PersonalFeed from './personalFeed'

const TabNav = TabNavigator({
    GlobalFeed: {
      screen: GlobalFeed
    },
    PersonalFeed: {
      screen: PersonalFeed
    }
  },{
    tabBarPosition: 'bottom'
  }
);

export default TabNav
