import React, { useEffect, useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import  ImagePicker from 'react-native-image-picker';
import {View,
   Alert,
   SafeAreaView,
   FlatList, 
   Text,
   Keyboard, 
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   TouchableOpacity,
   } from 'react-native'
import { color, globalStyle } from '../../utility';
import { Store } from "../../context/store";
import { LOADING_STOP, LOADING_START } from "../../context/actions/type";
import { uuid,smallDeviceHeight, keyboardVerticalOffset } from "../../utility/constants";

import { deviceHeight } from "../../utility/styleHelper/appStyle";
import { LogOutUser, UpdateUser } from "../../network";
import {InputField, Profile, ShowUsers, StickyHeader} from '../../component'
import { clearAsyncStroage } from "../../asyncStroage";
import firebase from "../../firebase/config";
const SearchUser = ({navigation}) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [search, setSearch] = useState('');
    const [searchUser, setSerachUser] = useState([]);
    const[check, setcheck] =useState(false)
    const [allUsers, setAllUsers] = useState([]);
    const [userDetail, setUserDetail] = useState({
        id: "",
        name: "",
        profileImg: "",
      });


    const searchlist = (text) => {
        dispatchLoaderAction({
            type: LOADING_START,
          });
          try {
            firebase
              .database()
              .ref("users")
              .on("value", (dataSnapshot) => {
                let users = [];
                let currentUser = {
                  id: "",
                  name: "",
                  profileImg: "",
                };
                dataSnapshot.forEach((child) => {
                  if (uuid === child.val().uuid) {
                    currentUser.id = uuid;
                    currentUser.name = child.val().name;
                    currentUser.profileImg = child.val().profileImg;
                  } else {
                    users.push({
                      id: child.val().uuid,
                      name: child.val().name,
                      profileImg: child.val().profileImg,
                    });
                  }
                });
                setUserDetail(currentUser);
                  setAllUsers(users);


                  dispatchLoaderAction({
                    type: LOADING_STOP,
                  });
                });
            } catch (error) {
              alert(error);
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
            }
  
        setSearch(text)
        if(text)
        {
        setcheck(true)
        let data = [];
        const temp = text.toLowerCase()
     
    
        data = allUsers.filter((item) => item.name.match(text)).map(({id,  name, profileImg,}) => ({id, name, profileImg}));
    
        
       
         
           setSerachUser(data)
       
    
        }
          else{
            setcheck(false)
        
          }
          }
            // * ON IMAGE TAP
                const imgTap = (profileImg, name) => {
                    //    alert('...........')
                        if (!profileImg) {
                        navigation.navigate("ShowFullImg", {
                            name,
                            imgText: name.charAt(0),
                        });
                        } else {
                        navigation.navigate("ShowFullImg", { name, img: profileImg });
                        }
                    };
                    
                    // * ON NAME TAP
                    const nameTap = (profileImg, name, guestUserId) => {
                        if (!profileImg) {
                        navigation.navigate("Chat", {
                            name,
                            imgText: name.charAt(0),
                            guestUserId,
                            currentUserId: uuid,
                        });
                        } else {
                        navigation.navigate("Chat", {
                            name,
                            img: profileImg,
                            guestUserId,
                            currentUserId: uuid,
                        });
                        }
                    };
          const [profile, toggleProfile] = useState(true);
            // * ON INPUT FOCUS

const handleFocus = () => {
    setTimeout(() => {
      toggleProfile(false);
    }, 200);
  };
  // * ON INPUT BLUR
  
  const handleBlur = () => {
    setTimeout(() => {
      toggleProfile(true);
    }, 200);
  };
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
             <InputField 
            placeholder="Search User" 
            onFocus={() => handleFocus()}
            onBlur={() => handleBlur()} 
            value={search}
            onChangeText={(e)=>searchlist(e)}
            />
            { 
       check &&
       <FlatList
        alwaysBounceVertical={false}
        data={searchUser}
        keyExtractor={(_, index) => index.toString()}
        
        renderItem={({ item }) => (
          <ShowUsers
          name={item.name}
          img={item.profileImg}
          onImgTap={() => imgTap(item.profileImg, item.name)}
          onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
        />
         
        )}
      />
       
  

      }
        </SafeAreaView>
       
    )
}
export default SearchUser;