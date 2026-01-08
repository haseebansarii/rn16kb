import React from 'react';
import {Alert, Modal} from 'react-native';

const CustomModal = (props: any) => {
  // console.log(props?.modalVisible);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props?.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props?.setModalVisible(!props?.modalVisible);
      }}>
      {props?.children}
    </Modal>
  );
};

export default CustomModal;
