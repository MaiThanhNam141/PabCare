import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../feature/context/UserContext';

const ProfileScreen = ({navigation}) => {
  const defaultAvatar = 'https://pabcare.com/wp-content/uploads/2023/11/1698813888606-2.jpg'
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)

  const {setUserLoggedIn} = useContext(UserContext)

  useEffect(() => {
    const fetchDataAndSetLoading = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData){
              const user = JSON.parse(userData)
              setDisplayName(user.displayName)
              setAvatar(user.photoURL)
            }
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu và set loading:", error);
        }
    };

    fetchDataAndSetLoading();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchDataAndSetLoading();
    });
    return unsubscribe;
}, [navigation]);

  const handleLogout = async () => {
    setLoading(true)
    const currentUser = auth().currentUser;
    const providerData = currentUser.providerData;
    providerData.forEach(profile => {
      if (profile.providerId === 'google.com') {
        googleSignOut();
      } else if (profile.providerId === 'facebook.com') {
        facebookSignOut();
      }
    });
  };

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      await AsyncStorage.removeItem('user')
      setUserLoggedIn(false)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const facebookSignOut = async () => {
    console.log('Logging out from Facebook');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={'#00ff00'}></ActivityIndicator>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {displayName ? displayName : "Guest"}</Text>
      <Image source={avatar ? { uri: avatar } : {uri:defaultAvatar}} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200, 
    height: 200, 
    marginBottom: 20,
    borderRadius:100,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginTop: 10,
    borderRadius:50
  },
});

export default ProfileScreen;
