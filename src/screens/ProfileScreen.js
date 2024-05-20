import React, { useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, ToastAndroid, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../feature/context/UserContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { defaultAvatar, logo, imageBG, profileScreenIcon } from '../data/Link';

const ProfileScreen = ({navigation}) => {
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')

  const [realName, setRealName] = useState('');
  const [phone, setPhone] = useState(0)
  const [address, setAddress] = useState('')

  const [realNameSub, setRealNameSub] = useState('');
  const [phoneSub, setPhoneSub] = useState(0)
  const [addressSub, setAddressSub] = useState('')

  const [loading, setLoading] = useState(true)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const {setUserLoggedIn} = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth().currentUser       
        const firestoreDataPromise = await firestore().collection('users').doc(user.uid).get();
        if (firestoreDataPromise.exists) {
          const userDataFromFirestore = firestoreDataPromise.data();
          setDisplayName(user.displayName || '');
          setAvatar(user.photoURL || '');
          setEmail(user.email || '');
          setRealName(userDataFromFirestore.fullName || '');
          setPhone(userDataFromFirestore.phone || '');
          setAddress(userDataFromFirestore.address || '');
          setLoading(false)
          return;
        } else {
          const userData = await AsyncStorage.getItem('user');
          const user = JSON.parse(userData) || {};
          if(user){
            setDisplayName(user.displayName || '');
            setAvatar(user.photoURL || '');
            setEmail(user.email || '');
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data and setting loading state:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);


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

  
  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    )
  }


  const updateInfo = async () => {
    try {
      const user = auth().currentUser;
      const userDocRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();
  
      if (userDoc.exists) {
        const userData = userDoc.data();
  
        const updatedUserData = {
          ...userData,
          phone: phoneSub !== '' ? phoneSub : userData.phone, 
          fullName: realNameSub !== '' ? realNameSub : userData.fullName, 
          address: addressSub !== '' ? addressSub : userData.address,
        };
  
        await userDocRef.update(updatedUserData);
        
        setAddress(addressSub)
        setRealName(realNameSub)
        setPhone(phoneSub)

        setAddressSub('');
        setRealNameSub('');
        setPhoneSub('');
  
        setIsUpdateModalVisible(false);
      }
    } catch (error) {
      console.log("updateInfo Error: ", error);
      ToastAndroid.show("Hãy nhập đầy đủ các thông tin", ToastAndroid.SHORT)
    }
  };
  
  const handleCooperation = () => {
    console.log('Cooperation')
  }

  const handleDonation = () => {
    console.log("Donation");
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBG} style={styles.imageBackground}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => {setIsUpdateModalVisible(true)}}
        >
          <MaterialIcons name="settings" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Hello, {displayName ? displayName : "Guest"}</Text>
        <Image source={avatar ? { uri: avatar } : {uri:defaultAvatar}} style={styles.imageAvatar} />
        <View>
          <TouchableOpacity onPress={handleCooperation} style={[styles.logoutContainer, styles.cooperateContainer]}>
            <Text style={styles.logoutText}>Hợp tác <Image source={profileScreenIcon.handshake} /></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDonation} style={[styles.logoutContainer, styles.donationContainer]}>
            <Text style={styles.logoutText}>Từ thiện <Image source={profileScreenIcon.heart} /></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={googleSignOut} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Đăng xuất <MaterialIcons name="logout" size={20} style={styles.logoutIcon} /></Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isUpdateModalVisible}
          onRequestClose={() => setIsUpdateModalVisible(false)}
        >
          <View style={styles.subModalContainer}>
            <Text style={styles.subModalTitle}>Thông tin người dùng</Text>
            <Image source={avatar ? { uri: avatar } : {uri:defaultAvatar}} style={[styles.imageAvatar, {width: 100, height: 100}]} />
            <KeyboardAvoidingView style={{marginTop: 5}}>
              <TextInput style={styles.textInput} value={email} editable={false}></TextInput>
              <TextInput
                style={[styles.textInput, {backgroundColor:"#fff"}]}
                placeholder='Họ và tên'
                onChangeText={(text) => setRealNameSub(text)} 
              >{realName?realName:''}</TextInput>
              <TextInput
                style={[styles.textInput, {backgroundColor:"#fff"}]}
                placeholder='Số điện thoại'
                inputMode='numeric'
                onChangeText={(text) => setPhoneSub(text)}
              >{phone?phone:''}</TextInput>
              <TextInput
                style={[styles.textInput, {backgroundColor:"#fff"}]}
                placeholder='Địa chỉ'
                onChangeText={(text) => setAddressSub(text)}
              >{address?address:''}</TextInput>

            </KeyboardAvoidingView>
            <TouchableOpacity style={[styles.logoutContainer, {backgroundColor:'#39a89b'}]} onPress={()=>updateInfo()}>
              <Text style={styles.logoutText}>Cập nhật</Text>
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
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer:{
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fafaf7',
    borderRadius: 25,
    width: '100%',
    height: '85%',
    alignSelf: 'flex-end',
    marginTop: '20%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageAvatar: {
    width: 200, 
    height: 200, 
    marginBottom: 15,
    borderRadius:100,
  },
  logoutContainer: {
    backgroundColor: '#cf3119',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    width:180,
    height:50,
    alignItems:'center'
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
    color: '#ffffff',
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
    marginBottom: 20,
  },
  textInput:{
    backgroundColor:'#f2f7f7',
    borderRadius:15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:'black',
    color:'black',
    minWidth: 300,
    margin:15
  },
  cooperateContainer:{
    backgroundColor: '#56C596',
  },
  donationContainer:{
    backgroundColor: '#329D9C',
  }
});

export default ProfileScreen;
