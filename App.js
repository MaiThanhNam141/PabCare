import React, { useEffect, useState } from 'react';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/feature/context/UserContext';
import { MusicProvider } from './src/feature/context/MusicContext';
import { SafeAreaView, StyleSheet, ToastAndroid, ImageBackground, Dimensions, Text, View } from 'react-native';
import { getCurrentUser } from './src/feature/firebase/handleFirestore';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { GOOGLE_API_CLIENT } from '@env';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { loadingScreen, signInbackground } from './src/data/Link'; 

const screen = Dimensions.get("window");

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserExist = async () => {
      GoogleSignin.configure({
        webClientId: GOOGLE_API_CLIENT,
      });
      const isUserExist = getCurrentUser();
      if (isUserExist) {
        setIsLoggedIn(true);
      }
    };
    checkUserExist();
  }, []);

  const onGoogleButtonPress = async () => {
    try {
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
        setIsLoggedIn(true);
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
      } else {
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
    }
  }

  setTimeout(() => setLoading(false), 1800)

  if (!isLoggedIn) {
    return (
      <ImageBackground source={loading ? loadingScreen : signInbackground} style={styles.loadingImage} resizeMethod='scale'>
        {loading ? null :
          <View style={{justifyContent:'flex-start'}}>
            <Text style={styles.signInText}>Đăng nhập</Text>
            <Text style={[styles.signInText, {fontSize: 14, fontWeight: '400', marginTop:0}]}>Đăng nhập để tiếp tục</Text>
          </View>
        }
        {loading ? null : <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={onGoogleButtonPress}/>}
      </ImageBackground>
    );
}


  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <UserProvider>
          <MusicProvider>
            {isLoggedIn && <BottomTabNavigation />}
          </MusicProvider>
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
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

export default App;
