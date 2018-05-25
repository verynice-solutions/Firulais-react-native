import React, { Component } from 'react'
import { TabNavigator, TabBarTop } from 'react-navigation';
import Colors from '../../utils/Colors'

import MyServices from './MyServicesView'
import Historial from './History'

const tabBarStyle = {
  tabBarPosition: 'bottom',
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    activeTintColor: 'black',
    inactiveTintColor: 'grey',
    activeBackgroundColor: 'rgba(0,0,0,0.1)',
    labelStyle: {
      fontSize: 14,
      fontFamily: 'Roboto',
    },
    style: {
      backgroundColor: 'white',
    },
    indicatorStyle:{
      backgroundColor: Colors.indigo,
    }
  },
  tabsStyle:{
    tabBarLabelColor: 'grey', // iOS only. change the color of tab text
    tabBarSelectedLabelColor: 'grey', // iOS only. change the color of the selected tab text
    forceTitlesDisplay: true, // Android only. If true - Show all bottom tab labels. If false - only the selected tab's label is visible.
    tabBarHideShadow: true // iOS only. Remove default tab bar top shadow (hairline)
  }
}

const TabNav = TabNavigator({
    Activos: {
      screen: MyServices
    },
    Historial: {
      screen: Historial
    }
  },tabBarStyle
);

export default TabNav
