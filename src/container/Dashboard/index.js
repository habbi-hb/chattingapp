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






const Dashboard = ({navigation}) => {
 const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;




  const [userDetail, setUserDetail] = useState({
    id: "",
    name: "",
    profileImg: "",
  });
  const [getScrollPosition, setScrollPosition] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [Friend, setFriends] = useState([]);
  const { profileImg, name } = userDetail;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SimpleLineIcons
          name="logout"
          size={26}
          color={color.WHITE}
          style={{ right: 10 }}
          onPress={() =>
            Alert.alert(
              "Logout",
              "Are you sure to log out",
              [
                {
                  text: "Yes",
                  onPress: () => logout(),
                },
                {
                  text: "No",
                },
              ],
              { cancelable: false }
            )
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
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
            }
           // else {
              users.push({
                id: child.val().uuid,
                name: child.val().name,
                profileImg: child.val().profileImg,
              });
           // }
          });
          setUserDetail(currentUser);
            setAllUsers(users);


            firebase
            .database()
            .ref("messeges")
            .on("value", (dataSnapshot) => {
              console.log(",,,,,,,,,,,,,,,,,",dataSnapshot)
              
            
            });
     

          //  let ary =[];
          //   for(let v=0; v<users.length; v++)
          //   {
                         
          //     if(currentUser.id==currentUser.id)
          //     {
          //       ary.push({
          //         id: users[v].uuid,
          //         name: users[v].name,
          //         profileImg: users[v].profileImg,
          //       });
          //     }
          //   }
          //   setFriends(ary)
   
          // let array =[]; 
          // for (let i=0; i<allUsers.length; i++)
          // {
           
          //   array[i]=allUsers[i].name

          // }
         
      
         
          
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
  }, []);




  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };

       
    ImagePicker.showImagePicker(options, (response) => {
        console.log("Response = ", response);
  
        if (response.didCancel) {
          console.log("User cancelled photo picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          // Base 64 image:
          let source = "data:image/jpeg;base64," + response.data;
          dispatchLoaderAction({
            type: LOADING_START,
          });
          UpdateUser(uuid, source)
            .then(() => {
              setUserDetail({
                ...userDetail,
                profileImg: source,
              });
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
            })
            .catch(() => {
              alert(err);
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
            });
        }
      });
  };
  // * LOG OUT
  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStroage()
          .then(() => {
            navigation.replace("Login");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(err));
  };

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
  // * GET OPACITY

  const getOpacity = () => {
    if (deviceHeight < smallDeviceHeight) {
      return deviceHeight / 4;
    } else {
      return deviceHeight / 6;
    }
  };
  



  return (
   
  
    <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
      {getScrollPosition > getOpacity() && (
        <StickyHeader
          name={name}
          img={profileImg}
          onImgTap={() => imgTap(profileImg, name)}
        />
      )}

      {/* ALL USERS */}
      
   


<FlatList
        alwaysBounceVertical={false}
        data={Friend}
        keyExtractor={(_, index) => index.toString()}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        ListHeaderComponent={
          <View
            style={{
              opacity:
                getScrollPosition < getOpacity()
                  ? (getOpacity() - getScrollPosition) / 100
                  : 0,
            }}
          >
            <Profile
              img={profileImg}
              onImgTap={() => imgTap(profileImg, name)}
              onEditImgTap={() => selectPhotoTapped()}
              name={name}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />


    
      
    
           <TouchableOpacity 
           onPress={()=>navigation.navigate('SearchUser')}
            style={{ 
                    position: 'absolute',
                  zIndex: 11,
                  right: 20,
                  bottom:20,
                  backgroundColor: '#fff',
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent:'center',
                  elevation: 8,}}>
            <Text style={{ 
              color: color.BLACK,
              fontSize: 24,}}>+</Text>
        </TouchableOpacity>
    </SafeAreaView>

  );
};

export default Dashboard;