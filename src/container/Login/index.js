import React from 'react';
import { Text, 
    SafeAreaView, 
    View,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,} from 'react-native'

import Logo from '../../component/logo'
import InputField from '../../component/Input'


import { color, globalStyle } from '../../utility';
import RoundCornerButton from '../../component/button/RoundCornerButton';
import { useState, useContext } from 'react';

import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import { LoginRequest } from '../../network';
import { keys, setAsyncStroge } from '../../asyncStroage';
import { keyboardVerticalOffset, setUniqueValue } from '../../utility/constants';

const Login = ({navigation}) => {
    const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [logo, toggleLogo] = useState(true);

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })
    const { email, password} = credentials;

    const handelOnChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value,
        })

    }
    onLoginpress = () => {
        if (!email) {
            alert('Email i required');
        } else if (!password) {
            alert('Password is required');
        } else {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            LoginRequest(email,password)
            .then((res)=>{
                if(!res.additionalUserInfo)
                {
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    });
                    alert(res)
                    return;
                }
                setAsyncStroge(keys.uuid, res.user.uid);
                setUniqueValue(res.user.uid);
                dispatchLoaderAction({
                    type: LOADING_STOP,
                });
                navigation.navigate("Dashboard")
                
            })
            .catch((err)=> {
                dispatchLoaderAction({
                    type: LOADING_STOP,
                });
                alert(err);
            })
    }
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

                <RoundCornerButton title="Login" onPress={()=>onLoginpress()}/>
                <Text 
                    style={{
                        fontSize: 28,
                        fontWeight:'bold',
                        color: color.LIGHT_GREEN,
                    }}
                    onPress={() => navigation.navigate('SignUp')}>
                    Sign Up
                </Text>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  
    )
}

export default Login;