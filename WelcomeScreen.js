import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ logo, room, loginButton }) => {
  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  image: {
    width: 340,
    height: 220,
    marginBottom: 20,
    borderRadius: 10,
  },
  textDecription: {
    margin: 5,
  },
  buttonLogin: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: 350,
    minHeight: 15,
    alignItems: 'center',
  },
  loginTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 22,
  },
});

export default WelcomeScreen;
