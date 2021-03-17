
import React from 'react';
import {Text, View,Image } from 'react-native';
import styles from './style';

export default Logo = ({logoStyle, logoTextStyle}) => (
  <View style={[styles.logo, logoStyle]}>
    <Image
    style={{width: 150, height: 150}}
        source={require('../../assets/logo.png')}
      />
  </View>
);