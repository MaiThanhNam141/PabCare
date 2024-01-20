import React, { Component } from 'react';
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
  { image: require('../../assets/pikachu-mega.png'), label: 'Part 1' },
  { image: require('../../assets/pikachu.png'), label: 'Part 2' },
  { image: require('../../assets/egg2rift.png'), label: 'Part 3' },
  { image: require('../../assets/egg1rift.png'), label: 'Part 4' },
  { image: require('../../assets/egg.png'), label: 'Part 5' },
];

export default class Focus extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      remainingSeconds: 5,
      isRunning: false,
      selectHour: "0",
      selectMinute: "30",
      selectSecond: "0",
      modalVisible: false
    };
    this.interval = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
      this.setState({ modalVisible: true });
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState((state) => ({
      remainingSeconds: parseInt(state.selectHour, 10) * 3600 + parseInt(state.selectMinute, 10) * 60 + parseInt(state.selectSecond, 30),
      isRunning: true
    }));

    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 1000);
  };

  stop = () => {
    if (this.interval)
      clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={this.state.selectHour}
        onValueChange={(itemValue) => {
          this.setState({ selectHour: itemValue });
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
        selectedValue={this.state.selectMinute}
        onValueChange={(itemValue) => {
          this.setState({ selectMinute: itemValue });
        }}
        mode="dropdown">
        {
          AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} style={styles.pickerItem} />
          ))
        }
      </Picker>
    </View>
  )

  getCurrentTimerPart = (totalTime, currentTime) => {
    const partDuration = totalTime / timerParts.length;
    return Math.floor(currentTime / partDuration);
  };

  renderTimer = () => {
    const { hours, minutes, seconds } = getRemaining(
      this.state.remainingSeconds
    );
    const totalTime = parseInt(this.state.selectHour, 10) * 3600 + parseInt(this.state.selectMinute, 10) * 60 + parseInt(this.state.selectSecond, 10);
    const currentPart = Math.min(timerParts.length - 1, this.getCurrentTimerPart(totalTime, this.state.remainingSeconds))

    return (
      <View style={styles.timerContainer}>
        {timerParts[currentPart] && (
          <Image source={timerParts[currentPart].image} style={styles.timerImage} />
        )}
        <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} />
        {
          this.state.isRunning ? (
            this.renderTimer()
          ) : (
            this.renderPickers()
          )
        }
        {
          this.state.isRunning ? (
            <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
              <Text style={[styles.buttonTextStop, styles.buttonText]}>Stop</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={this.start} style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )
        }
        <View>
          <Congrat modalVisible={this.state.modalVisible} setModalVisible={(value) => this.setState({ modalVisible: value })} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2.2,
    height: screen.width / 2.2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
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
    alignItems: "center"
  },
  timerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerImage: {
    width: 120,
    height: 120,
  },
});
