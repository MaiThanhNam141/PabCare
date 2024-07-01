import React, { useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, ToastAndroid, ImageBackground, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../feature/context/UserContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from "react-native-linear-gradient";
import { defaultAvatar, logo, imageBG } from '../data/Link';
import { getUserInfo, getUserDocumentRef } from '../feature/firebase/handleFirestore';

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

  const [userType, setUserType] = useState([])

  const [loading, setLoading] = useState(true)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const {setUserLoggedIn} = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firestoreDataPromise = await getUserInfo()
        if (firestoreDataPromise) {
          setDisplayName(firestoreDataPromise.displayName || '');
          setAvatar(firestoreDataPromise.photoURL || '');
          setEmail(firestoreDataPromise.email || '');
          setRealName(firestoreDataPromise.fullName || '');
          setPhone(firestoreDataPromise.phone || '');
          setAddress(firestoreDataPromise.address || '');
          setUserType(firestoreDataPromise.userType || [])
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

  const userTypeToBadgeMap = {
    ISTJ: require('../../assets/MBTI/ISTJ.jpg'),
    ISFJ: require('../../assets/MBTI/ISFJ.jpg'),
    INFJ: require('../../assets/MBTI/INFJ.jpg'),
    INTJ: require('../../assets/MBTI/INTJ.jpg'),
    ISTP: require('../../assets/MBTI/ISTP.jpg'),
    ISFP: require('../../assets/MBTI/ISFP.jpg'),
    INFP: require('../../assets/MBTI/INFP.jpg'),
    INTP: require('../../assets/MBTI/INTP.jpg'),
    ESTP: require('../../assets/MBTI/ESTP.jpg'),
    ESFP: require('../../assets/MBTI/ESFP.jpg'),
    ENFP: require('../../assets/MBTI/ENFP.jpg'),
    ENTP: require('../../assets/MBTI/ENTP.jpg'),
    ESTJ: require('../../assets/MBTI/ESTJ.jpg'),
    ESFJ: require('../../assets/MBTI/ESFJ.jpg'),
    ENFJ: require('../../assets/MBTI/ENFJ.jpg'),
    ENTJ: require('../../assets/MBTI/ENTJ.jpg'),
  }

  const badgeSources = userType.map(type => userTypeToBadgeMap[type]).filter(Boolean);

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
      <View style={{flex:1}}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    )
  }


  const updateInfo = async () => {
    try {
      const userDocRef = getUserDocumentRef()
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
  
  const handleCooperation = (route) => {
    navigation.navigate(route)
  }

  const handleDonation = () => {
    console.log("Donation");
  }

  return (
    <ImageBackground source={imageBG} style={styles.imageBackground}>
      <LinearGradient colors={['#FFFFFF', '#3A915E']} style={styles.mainContainer}>
        <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', marginBottom:30}}>
          <Image source={avatar ? { uri: avatar } : {uri:defaultAvatar}} style={styles.imageAvatar} />
          <View style={{flexDirection:'column'}}>
            <Text style={styles.title}>{displayName}</Text>
            <Text style={[styles.title, { fontWeight: '400', fontSize: 12}]}>{email}</Text>
            <Text style={styles.badgeTitle}>Huy hiệu</Text>
            {badgeSources.length > 0 ? (
              <FlatList
                data={badgeSources}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.badge} />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                style={styles.badgeList}
                showsHorizontalScrollIndicator={false}
              />
              ) : (
                <Text style={{alignSelf:'flex-start'}}>Boo! Không sở hữu huy hiệu</Text>
              )}
          </View>
        </View>
        <View style={styles.divider}/>
        <View>
          <TouchableOpacity onPress={() => handleCooperation("member")} style={[styles.logoutContainer, styles.cooperateContainer]}>
            <Text style={[styles.logoutText, {color:'#2EAC48'}]}>Đăng ký gói Prenium </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDonation} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Cửa hàng </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}/>
        <View>
          <TouchableOpacity onPress={handleCooperation} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Hợp tác </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDonation} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Từ thiện </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}/>
        <View>
          <TouchableOpacity onPress={() => {setIsUpdateModalVisible(true)}} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Thông tin thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDonation} style={styles.logoutContainer}>
            <Text style={styles.logoutText}>Hỗ trợ </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={googleSignOut} style={styles.logoutContainer}>
            <Text style={[styles.logoutText, { color:'red'}]}>Đăng xuất </Text>
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
            <TouchableOpacity style={[styles.logoutContainer, {backgroundColor:'#39a89b', alignItems:'center', marginTop: 15}]} onPress={()=>updateInfo()}>
              <Text style={[styles.logoutText]}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsUpdateModalVisible(false)}
            >
              <MaterialIcons name="close" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer:{
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fafaf7',
    borderRadius: 25,
    width: '100%',
    height: '88%',
    alignSelf: 'flex-end',
    marginTop: '20%'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom:5,
  },
  imageAvatar: {
    width: 100, 
    height: 100, 
    marginBottom: 10,
    marginRight:20,
    borderRadius:100,
    top:-35,
  },
  logoutContainer: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    width:320,
    height:47,
    alignItems:'flex-start',
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#a6a6a6'
  },
  logo: {
    width: '100%',
    height: '100%',
    opacity:1
  },
  logoutText:{
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
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
    marginBottom: 40,
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
  badgeList:{
    width:'85%',
    marginRight:5,
  },
  badge:{
    width:35,
    height:35,
    borderRadius:100,
    marginRight:5
  },
  badgeTitle:{
    fontWeight:'bold',
    marginVertical:0,
    fontSize:18
  },
  divider:{
    backgroundColor:'#fff',
    width:390,
    height:2,
    marginBottom:15,
    alignSelf:'center',
    marginTop:5,
},
});

export default ProfileScreen;
