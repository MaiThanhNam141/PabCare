import React, { useState, useEffect, useRef } from 'react';
import { focusBG, HomeScreenIcon, focusInbucator, streakOn, streakOff, pabmind } from '../../data/Link';
import { Vibration, Dimensions, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { getUserInfo, updateUserInfo } from '../../feature/firebase/handleFirestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screen = Dimensions.get("window");

const formatNumber = (number) => `0${number}`.slice(-2);
const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const remainingMinutes = time % 3600;
  const minutes = Math.floor(remainingMinutes / 60);
  const seconds = remainingMinutes % 60;
  return { hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

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
  const [selectHour, setSelectHour] = useState(0);
  const [selectMinute, setSelectMinute] = useState(30);
  const [selectSecond, _] = useState(0);
  const [coin, setCoin] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);
  const [lastDateFocus, setLastDateFocus] = useState('');
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef(null);
  let tempCoin = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setCoin(userData?.coin || 0);
          setFocusStreak(userData?.streak || 0);
          setLastDateFocus(userData?.lastDateFocus?.toDate() || 0);
        }
      } catch (error) {
        Alert.alert("Lỗi!", "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        console.error("Focus ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const currentTimeStamp = new Date();
    currentTimeStamp.setHours(0, 0, 0, 0);
    const millisecondsInOneDay = 86400000;
    const isOneDayAgo = Math.floor((currentTimeStamp - lastDateFocus) / millisecondsInOneDay);
    if (isOneDayAgo > 2) {
      setFocusStreak(0);
    }
  }, []);

  useEffect(() => {
    if (remainingSeconds === 0) {
      completeFocusSession();
    }
  }, [remainingSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const completeFocusSession = () => {
    try {
      stop();
      Vibration.vibrate(1000);
      setCoin(prev => prev + tempCoin);

      const newCoin = coin + tempCoin;
      const newFocusStreak = focusStreak + 1;
      const currentTimeStamp = new Date();
      currentTimeStamp.setHours(0, 0, 0, 0);
      const isOneDayAgo = Math.floor((currentTimeStamp - lastDateFocus) / 86400000);

      switch (isOneDayAgo) {
        case 0:
          updateUserInfo({ coin: newCoin });
          break;
        case 1:
          setFocusStreak(prev => prev + 1);
          updateUserInfo({ coin: newCoin, streak: newFocusStreak, lastDateFocus: currentTimeStamp });
          break;
        default:
          setFocusStreak(1);
          updateUserInfo({ coin: newCoin, streak: 1, lastDateFocus: currentTimeStamp });
          break;
      }
    } catch (error) {
      console.error("completeFocusSession: ", error);
    }
  };

  const start = () => {
    setRemainingSeconds(parseInt(selectHour, 10) * 3600 + parseInt(selectMinute, 10) * 60 + parseInt(selectSecond, 10));
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRemainingSeconds(0);
    setIsRunning(false);
  };

  const add = () => {
    let newMinute = parseInt(selectMinute, 10) + 15;
    let newHour = parseInt(selectHour, 10);

    if (newMinute >= 60) {
      newMinute = newMinute % 60;
      newHour = newHour + 1;
    }

    setSelectMinute(formatNumber(newMinute));
    setSelectHour(formatNumber(newHour));
  };

  const subtract = () => {
    let newMinute = parseInt(selectMinute, 10) - 15;
    let newHour = parseInt(selectHour, 10);

    if (newHour === 0 && newMinute === 0) 
      return;
    if (newMinute < 0) {
      newMinute = 60 + newMinute;
      newHour = newHour - 1;
    }

    setSelectMinute(formatNumber(newMinute));
    setSelectHour(formatNumber(newHour));
  };

  const renderTimePicker = () => (
    <View style={{justifyContent:'space-between'}}>
      <View style={{flexDirection:'row', alignItems:'center', width: screen.width-10, justifyContent:'center'}}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.btn}
          onPress={subtract}
        >
          <MaterialIcons name="remove" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.selectedTimeText}>{formatNumber(selectHour)}:{formatNumber(selectMinute)}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.btn}
          onPress={add}
        >
          <MaterialIcons name="add" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={start} style={styles.button}>
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentTimerPart = (totalTime, currentTime) => {
    const partDuration = totalTime / timerParts.length;
    return Math.floor(currentTime / partDuration);
  };

  const CoinPerSeconds = (totalTime) => {
    const coinPredict = Math.floor(totalTime / 60);
    return coinPredict;
  };

  const renderTimer = () => {
    const { hours, minutes, seconds } = getRemaining(remainingSeconds);
    const totalTime = selectHour * 3600 + selectMinute * 60;
    const currentPart = Math.min(timerParts.length - 1, getCurrentTimerPart(totalTime, remainingSeconds));

    tempCoin = CoinPerSeconds(totalTime);

    return (
      <View style={styles.timerContainer}>
        {timerParts[currentPart] && (
          <View style={{ width: 190, height: 190, justifyContent: 'center' }}>
            <Image source={focusInbucator} style={styles.inbucatorImage} />
            <Image source={timerParts[currentPart].image} style={styles.timerImage} />
          </View>
        )}
        <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.containerGif}>
        <ActivityIndicator color={'#87bc9d'} size={'large'} />
      </View>
    );

  return (
    <ImageBackground source={focusBG} style={styles.containerGif}>
      <View style={styles.titleContainer}>
        <View style={styles.header}>
          <Image source={pabmind} style={styles.logo} />
          <Text style={styles.userNameText}>PABMIND</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={[styles.coinContainer, { backgroundColor: 'transparent' }]}>
            <Text style={[styles.cointext, { color: "#87bc9d" }]}>{focusStreak}</Text>
            {focusStreak ?
              <Image source={streakOn} style={styles.coinImage} />
              : <Image source={streakOff} style={styles.coinImage} />
            }
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.cointext}>{coin}</Text>
            <Image source={HomeScreenIcon.coin} style={styles.coinImage} />
          </View>
        </View>
      </View>
      <View>
        {isRunning ? renderTimer() : renderTimePicker()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerGif: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: screen.width,
    resizeMode: 'contain'
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
    backgroundColor: 'rgba(135, 188, 157, 0.8)',
    borderColor: '#87bc9d',
    borderWidth: 1
  },
  buttonText: {
    fontSize: 28,
    color: "#DDDDDD"
  },
  timerText: {
    color: "#fff",
    fontSize: 40,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: screen.height
  },
  timerImage: {
    width: 120,
    height: 120,
    overflow: 'hidden',
    resizeMode: 'center',
    alignSelf: 'center',
  },
  inbucatorImage: {
    width: 190,
    height: 190,
    borderRadius: 100,
    overflow: 'hidden',
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0
  },
  titleContainer: {
    height: 45,
    width: screen.width - 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  coinContainer: {
    backgroundColor: '#3a915e',
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  cointext: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 11
  },
  coinImage: {
    resizeMode: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    width: 20,
    height: 20,
    marginLeft: 3
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft: 15,
    marginVertical: 6
  },
  userNameText: {
    color: '#87bc9d',
    fontWeight: '700',
    marginLeft: 5,
  },
  selectedTimeText: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    borderRadius:30,
    paddingVertical:10
  },
  btn: {
    backgroundColor: 'rgba(135, 188, 157, 0.8)',
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical:10,
    borderLeftWidth:1,
    marginHorizontal:15,
},
});

export default Focus;
