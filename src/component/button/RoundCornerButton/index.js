import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from './style';

export default RoundCornerButton = ({title, btnStyle, btnTextStyle, onPress}) => (
  <TouchableOpacity style={[styles.btn, btnStyle]} onPress={onPress}>
    <Text style={[styles.text, btnTextStyle]}>{title}</Text>
  </TouchableOpacity>
);