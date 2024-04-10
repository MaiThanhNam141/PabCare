import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ToastAndroid, ActivityIndicator, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_API_CLIENT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../feature/context/UserContext';

const LoginScreen = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_API_CLIENT,
  });

  const imageLink = require('../../assets/bg-image.jpg');
  const logo = require('../../assets/Icons/Logo.png');
  const { setUserLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  async function onGoogleButtonPress() {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
      const user = auth().currentUser;
      const userDoc = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(user)),
        firestore().collection('users').doc(user.uid).set(userDoc),
      ]);
      setUserLoggedIn(true);
      setLoading(false);
    } catch (error) {
      if (error.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show('Đang load đợi xíu', ToastAndroid.SHORT);
        console.log(statusCodes.IN_PROGRESS);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show('Điện thoại không có Google PlayServices', ToastAndroid.SHORT);
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else {
        console.log(error.message);
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#24A6D9" />
      </View>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground source={imageLink} style={styles.imageBackground}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.titleText}>Đăng nhập</Text>
          <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={onGoogleButtonPress} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fafaf7',
    borderRadius: 25,
    width: '100%',
    height: '85%',
    alignSelf: 'flex-end',
    marginTop:'20%'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 28,
    marginVertical: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
