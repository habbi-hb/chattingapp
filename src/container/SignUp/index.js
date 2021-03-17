import React from 'react';
import {
    Text,
    SafeAreaView,
    View,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
  } from "react-native";

import Logo from '../../component/logo'
import InputField from '../../component/Input'


import { color, globalStyle } from '../../utility';
import RoundCornerButton from '../../component/button/RoundCornerButton';
import { useState, useContext } from 'react';
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import { AddUser, SignUpRequest } from '../../network';
import {keys, setAsyncStroge} from '../../asyncStroage'
import { keyboardVerticalOffset, setUniqueValue } from '../../utility/constants';
import firebase from '../../firebase/config'

const SignUp = ({navigation}) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [credentials, setCredentials] = useState({
        name:'',
        email: '',
        password: '',
        confirmPassword:'',
    })
    const [logo, toggleLogo] = useState(true);
    const { name, email, password, confirmPassword} = credentials;

    onLoginpress = () => {
        if (!name) {
            alert('name is required');

        } else if (!email) {
            alert('Email is required');
        } else if (!password) {
            alert('Password is required');
        } else if (password !==  confirmPassword){
            alert('Password did not match')
        }  else {
            dispatchLoaderAction({
                type: LOADING_START
            });
            SignUpRequest(email,password)
            .then((res) => {
                if(!res.additionalUserInfo)
                {
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    });
                    alert(res)
                    return;
                }
                let uid = firebase.auth().currentUser.uid
                let profileImg = '';
                AddUser(name,email,uid,profileImg)
                .then(()=>{
                    setAsyncStroge(keys.uuid,uid);
                    setUniqueValue(uid);
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    });
                    navigation.replace('Dashboard')
                     
                })
                .catch((err)=> {
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    })
                    alert(err)
                });

            })
            .catch((err)=> {
                dispatchLoaderAction({
                    type:LOADING_STOP
                })
                alert(err)
            });
       
        }
    }

    const handelOnChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value,
        })

    }
    // * ON INPUT FOCUS

  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };
  // * ON INPUT BLUR

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };
  
    return (
        <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
      >
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
        {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}
             <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
             <InputField 
                placeholder="Enter name" 
                value={name} 
                onChangeText={(text) => handelOnChange('name', text)}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                /> 
             <InputField 
                placeholder="Enter email" 
                value={email} 
                onChangeText={(text) => handelOnChange('email', text)}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                />  
             <InputField 
                placeholder="Enter password"
                secureTextEntry={true}
                value={password} 
                onChangeText={(text) => handelOnChange('password', text)}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                /> 
                  <InputField 
                    placeholder="Confirm password" 
                    secureTextEntry={true}
                    value={confirmPassword} 
                    onChangeText={(text) => handelOnChange('confirmPassword', text)}
                    onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                /> 

             <RoundCornerButton title="Sign Up" onPress={()=>onLoginpress()}/>
             <Text 
                style={{
                    fontSize: 28,
                    fontWeight:'bold',
                    color: color.LIGHT_GREEN,
                }}
                onPress={() => navigation.navigate('Login')}>
                 Login
             </Text>

             </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  
    )
}

export default SignUp;