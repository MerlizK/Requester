/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';


export default function Menu({text}) {
  const navigation = useNavigation();
  const [menuAva,setMenuAva] = useState(true);
  const toggleMenuAva = () => setMenuAva(!menuAva);

  return (
  <View style={styles.container}>
    <View style={{paddingRight:60}}>
      <Text style={{fontSize:16}}>เมนูที่ {text}</Text>
      <Text style={{fontSize:16, color:'gray'}}>ราคา</Text>
    </View>
    <View style={{backgroundColor:'lightgray',width:60, height:50}}/>
    <TouchableOpacity onPress={toggleMenuAva} style={menuAva ? styles.menuYButton : styles.menuXButton}>
      {menuAva ? 
      (<Text style={{color:'white'}}>
        เหลือ
      </Text>):
      (<Text style={{color:'white'}}>
        หมด
      </Text>)
      }
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => navigation.navigate('EditMenu')} 
      style={{
        borderRadius: 5,
        width:25,height: 25,
        marginTop: 10,
        alignItems:'center'}}>
      <AntDesign name="setting" size={24} color="black" />
    </TouchableOpacity>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    height: 60,
    padding: 5,
    // backgroundColor: 'lightblue',
    // borderBottomColor: '#009951',
    // borderBottomWidth: 2,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuYButton: {
    backgroundColor:'#009951',
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  menuXButton: {
    backgroundColor:'#C00F0C',
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
});

