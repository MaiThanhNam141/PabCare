import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ToastAndroid, ActivityIndicator, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { UserContext } from '../feature/context/UserContext';
import { signInbackground } from '../data/Link';

const screen = Dimensions.get("window")

const LoginScreen = () => {
  const { setUserLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const onGoogleButtonPress = async() => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
  
      const user = auth().currentUser;
      if (user) { 
        const userRef = firestore().collection('users').doc(user.uid);
        const userDoc = await userRef.get();
  
        if (!userDoc.exists) {
          const userDocData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
  
          await userRef.set(userDocData);
        } 
        setUserLoggedIn(true);
        setLoading(false);
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
      } else {
        setLoading(false);
        ToastAndroid.show('Không thể lấy thông tin người dùng', ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show('Đang load đợi xíu', ToastAndroid.SHORT);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show('Điện thoại không có Google PlayServices', ToastAndroid.SHORT);
      } else {
        console.log("Login error: ", error.message);
        ToastAndroid.show('Đăng nhập không thành công', ToastAndroid.SHORT);
      }
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#24A6D9" />
      </View>
    );
  }

  return (
    <ImageBackground source={signInbackground} style={styles.loadingImage} resizeMethod='scale'>
          <View style={{justifyContent:'flex-start'}}>
            <Text style={styles.signInText}>Đăng nhập</Text>
            <Text style={[styles.signInText, {fontSize: 14, fontWeight: '400', marginTop:0}]}>Đăng nhập để tiếp tục</Text>
          </View>
        <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={onGoogleButtonPress}/>
      </ImageBackground>
  );

};

const styles = StyleSheet.create({
  loadingImage: {
    flex:1,
    height:screen.height,
    width:screen.width,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'space-around',
    resizeMode:'repeat',
  },
  signInText: {
    marginTop: 160,
    fontWeight:'bold',
    fontSize:34,
    color:'#3a915e',
    textAlign:'center'
  },
});

export default LoginScreen;
