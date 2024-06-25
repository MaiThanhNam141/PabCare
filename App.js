import React, { useEffect, useState, useMemo } from 'react';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/feature/context/UserContext';
import { Animated, View, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GOOGLE_API_CLIENT } from '@env';

export default App = () => {
  const [loading, setLoading] = useState(true)
  const [firstTime, setFirstTime] = useState(false)

  const fadeAnim = new Animated.Value(1)
  const translateYAnim = new Animated.Value(0);

  const logo = useMemo(() => require('./assets/Icons/Logo.png'), []);
  const room = useMemo(() => require('./assets/room.png'), []);

  GoogleSignin.configure({
    webClientId: GOOGLE_API_CLIENT,
  });

  useEffect(()=>{
    const start = async() => {
      setTimeout(() => {
        fadeOutAndMoveUp(); 
        setTimeout(() => setLoading(false), 2500);
      }, 450);
      const checkFirstTime = await AsyncStorage.getItem('isFirstTime')
      setFirstTime(Boolean(!checkFirstTime))
    }
    start()
  },[])

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

  async function loginButton() {
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
  
          await Promise.all([
            AsyncStorage.setItem('isFirstTime', JSON.stringify(false)),
            AsyncStorage.setItem('user', JSON.stringify(user)),
            userRef.set(userDocData),
          ]);
        } else {
          await Promise.all([
            AsyncStorage.setItem('isFirstTime', JSON.stringify(false)),
            AsyncStorage.setItem('user', JSON.stringify(user)),
          ]);
        }
        setFirstTime(false)
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
    finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16afc7" />
      {loading ? (
        <View style={styles.centered}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {firstTime ? (
            <View style={styles.welcomeContainer}>
              <Image source={logo} style={[styles.image, { width: 100, height: 100 }]} />
              <Image source={room} style={styles.image} />
              <View style={styles.textDecription}>
                <Text style={styles.welcomeTitle}>Let's start!</Text>
                <Text style={[styles.welcomeTitle, { fontSize: 17 }]}>Trung tâm dịch vụ Tâm lý Tổng hợp PABCARE</Text>
                <Text>Đừng để tiêu cực và những điều dối trá ăn mòn cuộc sống của bạn. Chúng tôi ở đây để hỗ trợ bạn tốt hơn!</Text>
              </View>
              <TouchableOpacity style={styles.buttonLogin} onPress={loginButton}>
                <Text style={styles.loginTitle}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setFirstTime(false)}>
                <Text>Skip</Text>
                <MaterialIcons name="close" size={25} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <NavigationContainer>
              <UserProvider>
                <BottomTabNavigation />
              </UserProvider>
            </NavigationContainer>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

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
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 255, 255, 1)',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  closeButton:{
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection:'row'
  },
  image: {
    width: 340, 
    height: 220, 
    marginBottom: 20,
    borderRadius:10,
  },
  textDecription:{
    margin: 5
  },
  buttonLogin:{
    backgroundColor:'red',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: 350,
    minHeight: 15,
    alignItems:'center',
  },
  loginTitle:{
    color: 'white',
    fontWeight:'700',
    fontSize: 22
  }
})

