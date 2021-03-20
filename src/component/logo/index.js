
import React from 'react';
import {Text, View,Image } from 'react-native';
import { color } from '../../utility';
import styles from './style';

export default Logo = ({logoStyle, logoTextStyle}) => (
  <View style={[styles.logo, logoStyle, {backgroundColor: color.WHITE}]}>
    <Image
    style={{width: 150, height: 88}}
        source={require('../../assets/logo.png')}
      />
  </View>
);