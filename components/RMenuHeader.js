/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
} from 'react-native';

const RMenuHeader = ({text}) => (
  <View style={styles.container}>
    <Text style={{borderRadius:30,padding:8,textAlign:'center',width:48,lineHeight: 30,backgroundColor:'green',fontSize: 20, color:'white', fontWeight: 'bold'}}>{'<'}</Text>
    <Text style={{marginTop:10,fontSize: 20, color:'black', fontWeight: 'bold'}}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 60,
    padding: 5,
    // backgroundColor: 'lightblue',
    borderBottomColor: 'green',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RMenuHeader;
