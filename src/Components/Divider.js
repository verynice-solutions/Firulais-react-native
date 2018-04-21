import React from 'react';

import { StyleSheet, View } from 'react-native'

const Divider = (props)=> {
  return (<View style={styles.line}>
         </View>)
}

export default Divider



const styles = StyleSheet.create({
  line: {
    height: 0.6,
    opacity: 0.3,
    backgroundColor: "#afafac",
  }
});
