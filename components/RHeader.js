/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
} from 'react-native';

const RHeader = ({text}) => (
  <View style={styles.container}>
    <Text style={{padding:12,textAlign:'center',width:48,lineHeight: 30,fontSize: 30, color:'black', fontWeight: 'bold'}}>{'<'}</Text>
    <Text style={{marginTop:10,fontSize: 24, color:'black', fontWeight: 'bold'}}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 60,
    padding: 5,
    // backgroundColor: 'lightblue',
    borderBottomColor: '#009951',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RHeader;
