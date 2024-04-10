import React, { useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../feature/context/UserContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen = ({navigation}) => {
  const defaultAvatar = 'https://pabcare.com/wp-content/uploads/2023/11/1698813888606-2.jpg'
  const logo = require('../../assets/Icons/Logo.png');

  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')
  const [realName, setRealName] = useState('');
  const [phone, setPhone] = useState(0)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const {setUserLoggedIn} = useContext(UserContext)

  useEffect(() => {
    const fetchDataAndSetLoading = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData){
              const user = JSON.parse(userData)
              setDisplayName(user.displayName)
              setAvatar(user.photoURL)
              setEmail(user.email)
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
        {/* <ActivityIndicator size={'large'} color={'#00ff00'}></ActivityIndicator> */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    )
  }


  const updateInfo = async() => {
    try {
      const user = auth().currentUser;
      const userDoc = {
        phone: phone,
        fullName: realName,
        address: address,
      };
      await firestore().collection('users').doc(user.uid).update(userDoc)
      setIsUpdateModalVisible(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => {setIsUpdateModalVisible(true)}}
      >
        <MaterialIcons name="settings" size={35} color="black" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Hello, {displayName ? displayName : "Guest"}</Text>
      <Image source={avatar ? { uri: avatar } : {uri:defaultAvatar}} style={styles.image} />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
        <Text style={styles.logoutText}>Logout <MaterialIcons name="logout" size={16} style={styles.logoutIcon} /></Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateModalVisible}
        onRequestClose={() => setIsUpdateModalVisible(false)}
      >
        <View style={styles.subModalContainer}>
          <Text style={styles.subModalTitle}>Thông tin người dùng</Text>
          <Image source={{uri: avatar}} style={[styles.image, {width: 100, height: 100}]} />
          <KeyboardAvoidingView style={{marginTop: 5}}>
            <TextInput style={styles.textInput} value={email} editable={false}></TextInput>
            <TextInput style={styles.textInput} placeholder='Họ và tên' onChangeText={(text)=>setRealName(text)}></TextInput>
            <TextInput style={styles.textInput} placeholder='Số điện thoại' inputMode='numeric' onChangeText={(text)=>setPhone(text)}></TextInput>
            <TextInput style={styles.textInput} placeholder='Địa chỉ' inputMode='text' multiline={true} onChangeText={(text)=>setAddress(text)}></TextInput>
          </KeyboardAvoidingView>
          <TouchableOpacity style={[styles.logoutContainer, {backgroundColor:'#4df0f0'}]} onPress={()=>updateInfo()}>
            <Text style={[styles.logoutText]}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsUpdateModalVisible(false)}
          >
            <MaterialIcons name="close" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
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
  logoutContainer: {
    backgroundColor: '#cf3119',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  logoContainer:{
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    opacity:1
  },
  logoutText:{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#f0f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginLeft: 10,
    color: 'white',
  },
  settingButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  settingsItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingsItemText: {
    fontSize: 18,
  },
  subModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 255, 255, 1)',
  },
  subModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  textInput:{
    backgroundColor:'#f2f7f7',
    borderRadius:15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:'black',
    color:'black',
    minWidth: 300,
    margin:15
  }
});

export default ProfileScreen;
