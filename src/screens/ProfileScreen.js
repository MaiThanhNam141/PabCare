import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const defaultAvatar = 'https://pabcare.com/wp-content/uploads/2023/11/1698813888606-2.jpg'
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setDisplayName(userDoc.data().displayName);
          setAvatar(userDoc.data().photoURL)
        }
      } else {
        navigation.navigate('loginscreen');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
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
      navigation.navigate('loginscreen');
    } catch (error) {
      console.error(error);
    }
  };

  const facebookSignOut = async () => {
    console.log('Logging out from Facebook');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {displayName}</Text>
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
