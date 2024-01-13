
import React, {Component, useState} from 'react';
import { Picker } from '@react-native-picker/picker';
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

// const [image, setImage] = useState(egg)
const screen = Dimensions.get("window")
const formatNumber = (number : number) => `0${number}`.slice(-2)
const getRemaining = (time : number) => {
  const hours = Math.floor(time / 3600)
  const remainingMinutes = time % 3600;
  const minutes = Math.floor(remainingMinutes / 60)
  const seconds = remainingMinutes % 60
  return {hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds)}
}

const createArray = (length : number) =>{
  const arr = Array.from({ length }, (_, i) => i.toString());
  return arr
}
const AVAILABLE_HOURS = createArray(24);
const AVAILABLE_MINUTES = createArray(60)


interface AppState {
  remainingSeconds: number;
  isRunning: boolean;
  selectHour: string;
  selectMinute: string;
  selectSecond: string;
}

interface TimerPart {
  image: any;
  label: string;
}

const timerParts: TimerPart[] = [
  { image: require('./assets/pikachu-mega.png'), label: 'Part 1' },
  { image: require('./assets/pikachu.png'), label: 'Part 2' },
  { image: require('./assets/egg1rift.png'), label: 'Part 3' },
  { image: require('./assets/egg.png'), label: 'Part 4' },
];

export default class App extends Component<{}, AppState>  {
  state: AppState = {
    remainingSeconds : 5,
    isRunning : false,
    selectHour: "0",
    selectMinute : "30",
    selectSecond : "0",
  }

  interval: NodeJS.Timeout | null = null;

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{ remainingSeconds : number}>, snapshot?: any): void {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0){
      this.stop()
    }
  }

  componentWillUnmount(): void {
    if (this.interval){
      clearInterval(this.interval)
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds: parseInt(state.selectHour, 10) * 3600 + parseInt(state.selectMinute, 10) * 60 + parseInt(state.selectSecond, 30),
      isRunning : true
    }))

    this.interval = setInterval (() =>{
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }))
    }, 1000)
  }

  stop = () =>{
    if (this.interval) 
      clearInterval(this.interval);
    this.interval = null
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    })
  }

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectHour}  
        onValueChange={(itemValue) => {
          this.setState({ selectHour: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_HOURS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItemSemiColon}>:</Text>
      <Picker 
        style={styles.picker} 
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectMinute}
        onValueChange={itemValue => {
          this.setState({selectMinute: itemValue})
        }}
        mode ="dropdown">
          {
            AVAILABLE_MINUTES.map(value => (
              <Picker.Item key={value} label={value} value={value} />
            ))
          }
        </Picker>
    </View>
  )
  
  getCurrentTimerPart = (totalTime: number, currentTime: number) => {
    const partDuration = totalTime / timerParts.length;
    return Math.floor(currentTime / partDuration);
  };

  renderTimer = () => {
    const { hours, minutes, seconds } = getRemaining(
      this.state.remainingSeconds
    );
    const totalTime = parseInt(this.state.selectHour, 10) * 3600 + parseInt(this.state.selectMinute, 10) * 60 + parseInt(this.state.selectSecond, 10);
    const currentPart = Math.min(timerParts.length - 1, this.getCurrentTimerPart(totalTime, this.state.remainingSeconds))

    console.log("currentPart:", currentPart);
    return (
      <View style={styles.timerContainer}>
        {timerParts[currentPart] && (
          <Image source={timerParts[currentPart].image} style={styles.timerImage} />
        )}
        <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
      </View>
    );
  };
  

  render(): React.ReactNode {
    return(
      <View style={styles.container}>
          <StatusBar barStyle={"light-content"}/>
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
            ):(
              <TouchableOpacity onPress={this.start} style={styles.button}>
                <Text style={ styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )
          }
      </View>
    )
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
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
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
    fontSize: 90
  },
  picker: {
    flex: 1,
    maxWidth: 150,
    marginLeft:0,
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
    width: 80, 
    height: 80,
},
});

