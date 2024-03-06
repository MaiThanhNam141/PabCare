import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ProfileScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setEmail(user.email.split('@')[0])
        console.log(user.email);
      } else {
        // User is NOT signed in
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
      navigation.navigate('loginscreen');
    } catch (error) {
      console.error(error);
    }
  };

  const facebookSignOut = async () => {
    console.log('Logging out from Facebook');
    // Your Facebook logout logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {email}</Text>
      <Button title="Logout" onPress={handleLogout} />
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
});

export default ProfileScreen;
