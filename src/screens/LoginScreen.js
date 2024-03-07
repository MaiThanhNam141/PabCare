import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const LoginScreen = ({navigation}) => {
  GoogleSignin.configure({
    webClientId: '361686552357-umi4m8v296443h5t790hpib4eo2idrtk.apps.googleusercontent.com',
  });
  const {heightS, widthS} = Dimensions.get("window")
  const imageLink = require('..//..//assets//bg-image.jpg')
  

  useEffect(()=>{
    const unsubcribe = auth().onAuthStateChanged(user => {
      if (user){
        navigation.navigate('profilescreen')
      }
    })
    return () => unsubcribe()
  },[])

  async function onGoogleButtonPress(){
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      const user = auth().currentUser;
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
    } catch (error) {
      if (error.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show('Đang load đợi xíu', ToastAndroid.SHORT)
        console.log(statusCodes.IN_PROGRESS)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show('Điện thoại không có Google PlayServices', ToastAndroid.SHORT)
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
      } else {
        console.log(error.message)
      }
    }
  }


  return (
    <View style={styles.backgroundContainer}>     
      <ImageBackground source={imageLink} height={heightS} width={widthS} style={styles.imageBackground}/>
      <View style={styles.container}>      
        <Text style={styles.titleText}>Đăng nhập</Text>
        <Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => onGoogleButtonPress()}
          />
        </Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    justifyContent:'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor:'#fafaf7',
    borderRadius:25,
    width:'100%',
    height:'85%',
    alignSelf:'flex-start',
  },
  imageBackground: {
    flex:1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  
  titleText: {
    fontSize: 28,
    margin: 14,
    fontWeight:'bold'
  },
  pressableGoBack: {
    marginTop: 2,
    position: 'absolute',
    zIndex: 10,
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, 
    width: 40,
    marginHorizontal: 4, 
    borderRadius: 20, 
    backgroundColor: 'black', 
  },
});


export default LoginScreen;
