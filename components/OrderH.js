/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,

  TouchableOpacity,
} from 'react-native';

import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../Constants';

export default function Menu({text}) {
  const [menuAva,setMenuAva] = useState(false);
  const [menuIn,setMenuIn] = useState(true);
  const toggleMenuAva = () => setMenuAva(!menuAva)
  const toggleMenuIn = () => setMenuIn(!menuIn)

  return (
  <View>
  <View style={styles.container}>
    <View style={{paddingRight:20}}>
      <View>
        <Text style={{fontSize:16}}>รายการสั่งซื้อที่ #{text}</Text>
        <Text style={{color:'gray',fontSize:14}}>รายละเอียด</Text>
      </View>
      
      {menuAva ? (
        <View style={{paddingLeft:30, marginBottom: 40}}>
          <Text style={{fontSize:16}}>เมนูที่ 1</Text>
          <Text style={{color:'gray'}}>จำนวนที่สั่ง</Text>
          <Text style={{color:'gray'}}>Option</Text>
          <Text style={{color:'gray'}}>Comment</Text>
        </View>
        
      ):null }
    </View>

    <View>
      {menuAva ? 
      ( <View>
        <Text style={{fontSize:16}}></Text>
        <Text style={{fontSize:14}}></Text>
        <Text style={{fontSize:16}}>ราคา</Text> 
        </View>) 
      : 
      ( <View>
        <Text style={{fontSize:16}}>         </Text>
        </View>) }
    </View>

    <View>
      <Text style={{fontSize:16}}>xx.xx บาท</Text>
      <Text style={{fontSize:14}}></Text>
      {menuAva ? ( <Text style={{fontSize:16}}>xx.xx บาท</Text> ) : (null) }
    </View>

    <TouchableOpacity onPress={toggleMenuAva} style={menuAva ? styles.menuYButton : styles.menuXButton}>
      {menuAva ? 
      (<Entypo name="chevron-small-down" size={28} color="black" />):
      (<Entypo name="chevron-small-right" size={28} color="black" />)
      }
    </TouchableOpacity>
  </View>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    padding: 5,
    // backgroundColor: 'lightblue',
    // borderBottomColor: '#009951',
    // borderBottomWidth: 2,
    marginVertical : 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuYButton: {
    // backgroundColor:'#009951',
    width: 50,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  menuXButton: {
    // backgroundColor:'black',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  addButton: {
    backgroundColor: Colors.PRIMARY_DARK,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    bottom: 0,
    alignSelf: 'flex-end',
    marginTop: 40,
    marginHorizontal: 10,
  },
});

