import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { focusBG, HomeScreenIcon, focusInbucator, streakOn, streakOff, pabmind } from '../../data/Link';
import { Vibration, Dimensions, StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
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
  const [selectedDate, setSelectedDate] = useState(new Date(0, 0, 0, 0, 23));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [coin, setCoin] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);
  const [lastDateFocus, setLastDateFocus] = useState('');
  const [loading, setLoading] = useState(true);

  const currentTimeStamp = new Date();
  currentTimeStamp.setHours(0, 0, 0, 0);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const userData = await getUserInfo();
        if (userData) {
          setCoin(userData?.coin || 0);
          setFocusStreak(userData?.streak || 0);
          setLastDateFocus(userData?.lastDateFocus?.toDate() || 0);
          setLoading(false);
        }
      };
      fetchData();
      const millisecondsInOneDay = 86400000;
      const isOneDayAgo = Math.floor((currentTimeStamp - lastDateFocus) / millisecondsInOneDay);
      if (isOneDayAgo > 2) {
        setFocusStreak(0);
      }
    } catch (error) {
      Alert.alert("Lỗi!", "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      console.error("Focus ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  let interval = null;
  let tempCoin = 0;

  useEffect(() => {
    if (remainingSeconds === 0) {
      completeFocusSession();
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
      Vibration.vibrate(1000);
      setCoin(prev => prev + tempCoin);
      setFocusStreak(prev => prev + 1);

      const newCoin = coin + tempCoin;
      const newFocusStreak = focusStreak + 1;

      const isOneDayAgo = Math.floor((currentTimeStamp - lastDateFocus) / 86400000);

      switch (isOneDayAgo) {
        case 0:
          updateUserInfo({ coin: newCoin });
          break;
        case 1:
          updateUserInfo({ coin: newCoin, streak: newFocusStreak, lastDateFocus: currentTimeStamp });
          break;
        default:
          updateUserInfo({ coin: newCoin, streak: 1, lastDateFocus: currentTimeStamp });
          break;
      }

      if (isOneDayAgo) {
        updateUserInfo({ coin: newCoin, streak: newFocusStreak, lastDateFocus: currentTimeStamp });
      } else {
        updateUserInfo({ coin: newCoin, lastDateFocus: currentTimeStamp });
      }

    } catch (error) {
      console.error("completeFocusSession: ", error);
    }
  };

  const start = () => {
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    setRemainingSeconds(hours * 3600 + minutes * 60);
    setIsRunning(true);

    interval = setInterval(() => {
      setRemainingSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);
  };

  const stop = () => {
    if (interval) clearInterval(interval);
    interval = null;
    setRemainingSeconds(0);
    setIsRunning(false);
  };

  const onTimeChange = (_, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowTimePicker(false);
  };

  const formatSelectedTime = (date) => {
    const hours = formatNumber(date.getHours());
    const minutes = formatNumber(date.getMinutes() + 7);
    return `${hours}:${minutes}`;
  };

  const renderTimePicker = () => (
    <View>
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onTimeChange}
          themeVariant="light"
        />
      )}
      <TouchableOpacity onPress={start} style={styles.button}>
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>Chọn giờ</Text>
      </TouchableOpacity>
      <Text style={styles.selectedTimeText}>{formatSelectedTime(selectedDate)}</Text>
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
    const totalTime = selectedDate.getHours() * 3600 + selectedDate.getMinutes() * 60;
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
      <StatusBar barStyle={"light-content"} />
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
    marginTop: screen.height / 2.5,
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
    alignSelf: 'flex-start'
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
    borderWidth:2,
    borderRadius:30,
    paddingVertical:10
  },
});

export default Focus;
