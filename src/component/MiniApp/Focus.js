import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Congrat from './Congrat';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';

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

  let interval = null;

  useEffect(() => {
    if (remainingSeconds === 0) {
      stop();
      setModalVisible(true);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

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
          <Picker.Item key={value} label={value} value={value} style={styles.pickerItem} />
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

  const renderTimer = () => {
  
    const { hours, minutes, seconds } = getRemaining(remainingSeconds);
    const totalTime = parseInt(selectHour, 10) * 3600 + parseInt(selectMinute, 10) * 60 + parseInt(selectSecond, 10);
    const currentPart = Math.min(timerParts.length - 1, getCurrentTimerPart(totalTime, remainingSeconds));
  
    return (
      <View style={styles.timerContainer}>
        {timerParts[currentPart] && (
          <Image source={timerParts[currentPart].image} style={styles.timerImage} />
        )}
        <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      {
        isRunning ? (
          renderTimer()
        ) : (
          renderPickers()
        )
      }
      {
        isRunning ? (
          <TouchableOpacity onPress={stop} style={[styles.button, styles.buttonStop]}>
            <Text style={[styles.buttonTextStop, styles.buttonText]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )
      }
      <View>
        <Congrat modalVisible={modalVisible} setModalVisible={(value) => setModalVisible(value)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  timerText: {
    color: "#fff",
    fontSize: 70
  },
  picker: {
    flex: 1,
    maxWidth: 150,
    marginLeft: 0,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "rgba(92, 92, 92, 0.206)",
      }
    }),
  },
  pickerItem: {
    color: "#fff",
    backgroundColor: "rgba(92, 92, 92, 0.206)",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      }
    })
  },
  pickerItemSemiColon: {
    color: "#fff",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      }
    })
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: screen.height/3.4
  },
  timerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screen.height/5.9
  },

  timerImage: {
    width: 120,
    height: 120,
  },
});

export default Focus;
