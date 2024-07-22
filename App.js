import React, { useEffect, useState, useMemo, useRef } from 'react';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/feature/context/UserContext';
import { MusicProvider } from './src/feature/context/MusicContext';
import { Animated, View, Image, SafeAreaView, StatusBar, StyleSheet, ToastAndroid } from 'react-native';
import { getCurrentUser } from './src/feature/firebase/handleFirestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_API_CLIENT } from '@env';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const logo = useMemo(() => require('./assets/Icons/Logo.png'), []);

  useEffect(() => {
    const checkUserExist = async () => {
      GoogleSignin.configure({
        webClientId: GOOGLE_API_CLIENT,
      });
      const isUserExist = await getCurrentUser();
      if (isUserExist) {
        setIsLoggedIn(true);
      } else {
        onGoogleButtonPress();
      }
    };
    const start = async () => {
      setTimeout(() => {
        fadeOutAndMoveUp();
        setTimeout(() => setLoading(false), 2500);
      }, 450);
    };
    checkUserExist();
    start();
  }, []);

  const fadeOutAndMoveUp = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -150,
        duration: 2500,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
    if (!loading && !isLoggedIn) {
      onGoogleButtonPress();
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16afc7" />
        <View style={styles.centered}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16afc7" />
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
  logoContainer: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default App;
