/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';

import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../Constants';

export default function Menu({text}) {
  const [menuAva,setMenuAva] = useState(false);
  const [menuIn,setMenuIn] = useState(true);
  const toggleMenuAva = () => setMenuAva(!menuAva);
  const toggleMenuIn = () => setMenuIn(!menuIn);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = () => {
    toggleMenuIn();
    setIsModalVisible(false);
  };

  return (
  <View>
    {menuIn ? ( 
    <View style={styles.container}>
      <View>
      <Entypo name="location-pin" size={24} color="black" />
      </View>
      <View style={{paddingRight:60}}>
        <Text style={{fontSize:16}}>ออเดอร์ที่ {text}</Text>
        {menuAva ? (
          <View style={{paddingLeft:30}}>
            <Text>เมนูที่ 1</Text>
            <Text>จำนวนที่สั่ง</Text>
            <Text>Option</Text>
            <Text>Comment</Text>
          </View>
          
        ):
        null
        }
      </View>
      <View>
        <Text>ค่าอาหาร</Text>
        {menuAva ? ( <Text>ราคา</Text> ) : (null) }
      </View>
      <View>
        <Text>xx.xx บาท</Text>
        {menuAva ? ( <Text>xx.xx บาท</Text> ) : (null) }
      </View>
      <TouchableOpacity onPress={toggleMenuAva} style={menuAva ? styles.menuYButton : styles.menuXButton}>
        {menuAva ? 
        (<Entypo name="chevron-small-down" size={28} color="black" />):
        (<Entypo name="chevron-small-right" size={28} color="black" />)
        }
      </TouchableOpacity>
    </View>
    ) : null }
    {menuIn ? ( 
      <View>
      {menuAva ? ( 
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
          <Text style={{color:'white'}}>ทำอาหารเสร็จแล้ว</Text>
        </TouchableOpacity>
        
        ) : null}
      </View>
    ) : null}

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>ยืนยันการทำอาหารเสร็จสิ้น?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDelete}>
                <Text style={styles.buttonText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    maxHeight: 120,
    padding: 5,
    // backgroundColor: 'lightblue',
    // borderBottomColor: '#009951',
    // borderBottomWidth: 2,
    marginVertical: 20
    ,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuYButton: {
    // backgroundColor:'#009951',
    width: 30,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker background
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
    height: Dimensions.get('window').width * 0.4,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

