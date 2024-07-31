import React, { useEffect, useState, useRef } from 'react';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/feature/context/UserContext';
import { MusicProvider } from './src/feature/context/MusicContext';
import { Easing, Animated, SafeAreaView, StyleSheet, ToastAndroid, ImageBackground, Dimensions, TouchableOpacity, Text } from 'react-native';
import { getCurrentUser } from './src/feature/firebase/handleFirestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_API_CLIENT } from '@env';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { loadingScreen } from './src/data/Link'; 
import { shadow } from 'react-native-paper';

const screen = Dimensions.get("window");

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserExist = async () => {
      GoogleSignin.configure({
        webClientId: GOOGLE_API_CLIENT,
      });
      const isUserExist = getCurrentUser();
      if (isUserExist) {
        setIsLoggedIn(true);
      } else {
        onGoogleButtonPress();
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

  useEffect(() => {
    if (!isLoggedIn) {
      onGoogleButtonPress();
    }
  }, [isLoggedIn]);

  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.circle,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.circle,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.circle,
        })
      ])
    ).start();
  }, [borderColorAnim]);

  const borderColorInterpolation = borderColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#ff0080', '#00f0ff', '#00ff0f'], 
  });

  const animatedStyle = {
    borderColor: borderColorInterpolation,
  };

  if (!isLoggedIn) {
    return (
      <ImageBackground source={loadingScreen} style={styles.loadingImage} resizeMethod='auto'>
        <TouchableOpacity style={[styles.button, animatedStyle]} onPress={onGoogleButtonPress}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    flex:1,
    width: 'auto',
    height: screen.height,
    alignItems:'center',
    justifyContent:'flex-end',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom:150,
    borderWidth:2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
