import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Congrat from './Congrat';
import { focusBG, HomeScreenIcon, defaultAvatar, focusInbucator, streakOn, streakOff } from '../../data/Link';
import { Dimensions, StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { getUserInfo, updateUserInfo } from '../../feature/firebase/handleFirestore';

const screen = Dimensions.get("window");

const formatNumber = (number) => `0${number}`.slice(-2);
const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const remainingMinutes = time % 3600;
  const minutes = Math.floor(remainingMinutes / 60);
  const seconds = remainingMinutes % 60;
  return { hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (length) => {
  const arr = Array.from({ length }, (_, i) => i.toString());
  return arr;
};
const AVAILABLE_HOURS = createArray(24);
const AVAILABLE_MINUTES = createArray(60);

const timerParts = [
  { image: require('../../../assets/pikachu-mega.png'), label: 'Part 1' },
  { image: require('../../../assets/pikachu.png'), label: 'Part 2' },
  { image: require('../../../assets/egg2rift.png'), label: 'Part 3' },
  { image: require('../../../assets/egg1rift.png'), label: 'Part 4' },
  { image: require('../../../assets/egg.png'), label: 'Part 5' },
];

const Focus = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [selectHour, setSelectHour] = useState("0");
  const [selectMinute, setSelectMinute] = useState("30");
  const [selectSecond] = useState("0");
  const [modalVisible, setModalVisible] = useState(false);
  const [logoUser, setLogoUser] = useState('')
  const [displayName, setDisplayName] = useState('');
  const [coin, setCoin] = useState(0)
  const [focusStreak, setFocusStreak] = useState(0)
  const [lastDateFocus, setLastDateFocus] = useState('')
  const [loading, setLoading] = useState(true)

  const currentTimeStamp = new Date();
  currentTimeStamp.setHours(0, 0, 0, 0);

  useEffect(()=>{
    try {
      const fetchData = async() => {
        const userData = await getUserInfo();
        if(userData){
          setLogoUser(userData.photoURL || defaultAvatar);
          setDisplayName(userData.displayName || '');
          setCoin(userData?.coin  || 0);
          setFocusStreak(userData?.streak || 0);
          setLastDateFocus(userData?.lastDateFocus || 0)
          setLoading(false);
        }
        
      }
      fetchData()
    } catch (error) {
      Alert.alert("Lỗi!", "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      console.error("Focus ", error)
    }
  }, [])

  let interval = null;
  let tempCoin = 0;

  useEffect(() => {
    if (remainingSeconds === 0) {
      completeFocusSession()
    }
  }, [remainingSeconds]);

  useEffect(() => {
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const completeFocusSession = () => {
    try {
      stop();
      setCoin(prev => prev + tempCoin)
      setFocusStreak(prev => prev + 1)

      const newCoin = coin + tempCoin;
      const newFocusStreak = focusStreak + 1;

      if( lastDate !== currentTimeStamp)
        updateUserInfo({ coin: newCoin, streak: newFocusStreak, lastDateFocus: currentTimeStamp });
      else updateUserInfo({ coin: newCoin, lastDateFocus: currentTimeStamp });

      setModalVisible(true);
    } catch (error) {
      console.error("completeFocusSession: ", error);
    }
  }

  const start = () => {
    setRemainingSeconds(parseInt(selectHour, 10) * 3600 + parseInt(selectMinute, 10) * 60 + parseInt(selectSecond, 10));
    setIsRunning(true);

    interval = setInterval(() => {
      setRemainingSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);
  };

  const stop = () => {
    if (interval)
      clearInterval(interval);
    interval = null;
    setRemainingSeconds(0);
    setIsRunning(false);
  };

  const renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={selectHour}
        onValueChange={(itemValue) => {
          setSelectHour(itemValue);
        }}
        
        mode="dropdown"
      >
        {AVAILABLE_HOURS.map((value) => (
          <Picker.Item key={value} label={value} value={value} style={styles.pickerItem}  />
        ))}
      </Picker>
      <Text style={styles.pickerItemSemiColon}>:</Text>
      <Picker
        style={styles.picker}
        selectedValue={selectMinute}
        onValueChange={(itemValue) => {
          setSelectMinute(itemValue);
        }}
        mode="dropdown">
        {
          AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} style={styles.pickerItem} />
          ))
        }
      </Picker>
    </View>
  );

  const getCurrentTimerPart = (totalTime, currentTime) => {
    const partDuration = totalTime / timerParts.length;
    return Math.floor(currentTime / partDuration);
  };

  const CoinPerSeconds = (totalTime) => {
    const coinPredict = Math.floor(totalTime / 60);
    return coinPredict
  }

  const renderTimer = () => {
    const { hours, minutes, seconds } = getRemaining(remainingSeconds);
    const totalTime = parseInt(selectHour, 10) * 3600 + parseInt(selectMinute, 10) * 60 + parseInt(selectSecond, 10);
    const currentPart = Math.min(timerParts.length - 1, getCurrentTimerPart(totalTime, remainingSeconds));
  
    tempCoin = CoinPerSeconds(totalTime)
    
    return (
      <View style={styles.timerContainer}>
        {timerParts[currentPart] && (
          <View style={{width: 190, height: 190, justifyContent:'center'}}>
            <Image source={focusInbucator} style={styles.inbucatorImage} />
            <Image source={timerParts[currentPart].image} style={styles.timerImage} />
          </View>
        )}
        <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
      </View>
    );
  };
  
  if(loading)
    return (
    <View style={styles.containerGif}>
      <ActivityIndicator color={'#87bc9d'} size={'large'}/>
    </View>
    )

  return (
    <ImageBackground source={focusBG} style={styles.containerGif}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.titleContainer}>

      <View style={styles.header}>
        <Image source={{uri: logoUser || defaultAvatar}} style={styles.logo} />
        <Text style={styles.userNameText}>{displayName}</Text>
      </View>

      <View style={{flexDirection:'row', marginTop:10}}>
        <View style={[styles.coinContainer, {backgroundColor:'transparent'}]}>
          <Text style={[styles.cointext, {color: "#87bc9d"}]}>{focusStreak}</Text>
          { focusStreak ? 
            <Image source={streakOn} style={styles.coinImage} /> 
            :<Image source={streakOff} style={styles.coinImage} />
          }
        </View>

        <View style={styles.coinContainer}>
          <Text style={styles.cointext}>{coin}</Text>
          <Image source={HomeScreenIcon.coin} style={styles.coinImage} />
        </View>

      </View>

    </View>
      {
        isRunning ? (
          renderTimer()
        ) : (
          renderPickers()
        )
      }
      {
        isRunning ? (
          // <TouchableOpacity onPress={stop} style={[styles.button, {borderColor:'#F3601A'}]}>
          //   <Text style={[styles.buttonText, {color: '#F3601A'}]}>Dừng</Text>
          // </TouchableOpacity>
          null
        ) : (
          <View>
            <TouchableOpacity onPress={start} style={styles.button}>
              <Text style={styles.buttonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerGif:{
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width:screen.width,
    resizeMode:'contain'
  },
  button: {
    width:150,
    height:150,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
    backgroundColor: 'rgba(135, 188, 157, 0.8)',
    borderColor:'#87bc9d',
    borderWidth:1
  },
  buttonText: {
    fontSize: 30,
    color: "#DDDDDD"
  },
  timerText: {
    color: "#fff",
    fontSize: 40,
  },
  picker: {
    flex: 1,
    maxWidth: 140,
    marginLeft: 0,
    color: "#fff",
    backgroundColor: "#5BA8A0",
  },

  pickerItem: {
    color: "#fff",
    backgroundColor: "#94B447",
    fontSize: 20,
  },

  pickerItemSemiColon: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: screen.height/2.5,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: screen.height
  },
  timerImage: {
    width: 120,
    height: 120,
    overflow:'hidden',
    resizeMode:'center',
    alignSelf:'center',
  },
  inbucatorImage:{
    width:190,
    height:190,
    borderRadius:100,
    overflow:'hidden',
    resizeMode:'contain',
    position:'absolute',
    top: 0,
    left:0
  },
  titleContainer:{
    height:45,
    width:screen.width-10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    marginTop:5,
    alignSelf:'flex-start'
  },
  coinContainer:{
    backgroundColor:'#3a915e',
    paddingVertical:5,
    paddingRight:10,
    paddingLeft:40,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  cointext:{
    color:'#ffffff',
    fontWeight:'800',
    fontSize:11
  },
  coinImage:{
    resizeMode:'center',
    borderRadius:100,
    overflow:'hidden',
    width:20,
    height:20,
    marginLeft:3
  },
  header: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },  
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    alignSelf:'center',
    borderRadius:100,
    marginLeft:15,
    marginVertical:6
  },
  userNameText:{
    color:'#87bc9d',
    fontWeight:'700',
    marginLeft:5
  },
});

export default Focus;
