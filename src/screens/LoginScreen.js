import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ToastAndroid, ActivityIndicator, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { UserContext } from '../feature/context/UserContext';
import { imageBG, logo } from '../data/Link';

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#24A6D9" />
      </View>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground source={imageBG} style={styles.imageBackground}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={{alignItems:'center'}}>
            <Text style={styles.titleText}>Đăng nhập</Text>
            <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={onGoogleButtonPress} />
          </View>
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
    justifyContent: 'space-evenly',
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
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 28,
    marginVertical: 10,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
