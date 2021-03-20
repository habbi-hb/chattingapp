import React, { useLayoutEffect, useState, useEffect, Fragment } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Modal,
} from "react-native";
import {Button, Input, Item,} from 'native-base'
import ImagePicker from "react-native-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyle, color, appStyle } from "../../utility";
import styles from "./styles";
import { InputField, ChatBox } from "../../component";
import firebase from "../../firebase/config";
import { senderMsg, recieverMsg } from "../../network";
import { deviceHeight } from "../../utility/styleHelper/appStyle";
import { smallDeviceHeight } from "../../utility/constants";
import Entypo from "react-native-vector-icons/Entypo";

const Chat = ({ route, navigation }) => {
  const { params } = route;
  const { name, img, imgText, guestUserId, currentUserId } = params;
  const [msgValue, setMsgValue] = useState("");
  const [messeges, setMesseges] = useState([]);
  const [modal, setModal] = React.useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <Text>{name}</Text>,
      headerRight: () => (
        <Entypo
          name="dots-three-vertical"
          size={26}
          color={color.WHITE}
          style={{ right: 10 }}
         onPress={()=> setModal(true)}
      
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    try {
      firebase
        .database()
        .ref("messeges")
        .child(currentUserId)
        .child(guestUserId)
        .on("value", (dataSnapshot) => {
          let msgs = [];
          dataSnapshot.forEach((child) => {
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              img: child.val().messege.img,
            });
          });
          setMesseges(msgs.reverse());
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleSend = () => {
    setMsgValue("");
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));

      // * guest user

      recieverMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));
    }
  };

  const handleCamera = () => {
    const option = {
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(option, (response) => {
      if (response.didCancel) {
        console.log("User cancel image picker");
      } else if (response.error) {
        console.log(" image picker error", response.error);
      } else {
        // Base 64
        let source = "data:image/jpeg;base64," + response.data;

        senderMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));

        // * guest user

        recieverMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));
      }
    });
  };

  const handleOnChange = (text) => {
    setMsgValue(text);
  };

  //   * On image tap
  const imgTap = (chatImg) => {
    navigation.navigate("ShowFullImg", { name, img: chatImg });
  };

  //...........set modal
  const addService = () => {
    
    setModal(false);
    
      
  }
  return (
    <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
      >
        <TouchableWithoutFeedback
          style={[globalStyle.flex1]}
          onPress={Keyboard.dismiss}
        >
          <Fragment>
            <FlatList
              inverted
              data={messeges}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <ChatBox
                  msg={item.msg}
                  userId={item.sendBy}
                  img={item.img}
                  onImgTap={() => imgTap(item.img)}
                />
              )}
            />

            {/* Send Message */}
            <View style={styles.sendMessageContainer}>
              <InputField
                placeholder="Type Here"
                numberOfLines={10}
                inputStyle={styles.input}
                value={msgValue}
                onChangeText={(text) => handleOnChange(text)}
              />
              <View style={styles.sendBtnContainer}>
                <MaterialCommunityIcons
                  name="camera"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={() => handleCamera()}
                />
                <MaterialCommunityIcons
                  name="send-circle"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={() => handleSend()}
                />
              </View>
            </View>
            <Modal
              animationType={'fade'}
              transparent={true}
              visible={modal}
              onRequestClose={() => setModal(false)}
              on
              >
              <View style={{    flex:1,
                              justifyContent:'center',
                              alignItems:'center',
                              backgroundColor:'rgba(0,0,0,0.5)',
                              borderRadius:5,
                              padding:10,
                              alignItems:'center'}}>
                <View style={{  height:200,
                              width:300,
                              backgroundColor:'#fff',
                              borderRadius:15,
                              justifyContent:'space-between',
                              alignItems:'center',
                              alignSelf:'center'}}>
                  <View style={{width:'100%'}}>
                  <View style={{flexDirection:'row',alignSelf:'center',marginVertical:10}}>
                      <Text style={{fontSize:14,fontWeight:'bold',color:'#187ce6',}}>Input Amount</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:10}}>
                      <View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}} />
                      
                    </View>
                  
                 
                    <View >
                    <Item
                        style={{
                          width: '95%',
                          marginLeft: '2%',
                          borderColor: 'black',
                          borderWidth: 1,
                          marginBottom:10
                        }}
                        rounded>
                    
                 
                        <Input
                            placeholder="-$"
                            style={{height: 40}}
                            keyboardType='numeric'
                          
                          />
                          </Item>
                    
                    </View>
                    <Button
                      danger={true}
                      style={{    
                            width: '85%',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          justifyContent: 'center',
                          marginTop: '4%',}}
                      rounded
                      active={true}
                      onPress={()=>setModal(false)}
                      >
                      <Text style={styles.btnTxt}>Add</Text>
                    </Button>
                  </View> 
                  
                </View>
              </View>
            </Modal>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
