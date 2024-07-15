import React, { useEffect, useContext, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, Image, Easing, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Clock, Disc, Play, Stop, tenseconds } from '../../data/Link';
import { MusicContext } from '../../feature/context/MusicContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateUserInfo, getUserInfo } from '../../feature/firebase/handleFirestore';

const Music = () => {
  const { currentSongContext, isPlayingSong, setIsPlayingSong, setRoll } = useContext(MusicContext);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [favor, setFavor] = useState(true);
  const [selectHour, setSelectHour] = useState(3);
  const [selectMinute, setSelectMinute] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [position, setPosition] = useState(0);
  const soundRef = useRef(null);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 14000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    );

    if (isPlayingSong) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
      spinValue.setValue(0);
    }

    return () => {
      spinAnimation.stop();
    };
  }, [isPlayingSong, spinValue]);

  useEffect(() => {
    if (favor)
      updateUserInfo({ favor: currentSongContext.title });
  }, [favor, currentSongContext.title]);

  useEffect(() => {
    const getFavor = async () => {
      try {
        const snapshot = await getUserInfo();
        if (snapshot) {
          const title = snapshot.favor || "Track1";
          if (title === currentSongContext.title) {
            setFavor(true);
          } else {
            setFavor(false);
          }
        }
      } catch (error) {
        setFavor(false);
        Alert.alert("Lỗi", "error");
        console.log(error);
      }
    };
    getFavor();
  }, [currentSongContext]);

  const togglePlayPause = () => {
    if (isButtonDisabled)
      return Alert.alert("Lỗi", "Bạn bấm quá nhanh sẽ gây ra lỗi");
    
    if (isPlayingSong) {
      soundRef.current?.getCurrentTime((seconds) => {
        setPosition(seconds);
      });
      soundRef.current?.pause();
    } else {
      if (soundRef.current) {
        soundRef.current.setCurrentTime(position);
        soundRef.current.play((success) => {
          if (!success) {
            console.log("Failed to play the audio");
          }
        });
      }
    }
    setIsPlayingSong(!isPlayingSong);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 700);
  };

  const toggleRoll = () => {
    if (isButtonDisabled)
      return Alert.alert("Lỗi", "Bạn bấm quá nhanh sẽ gây ra lỗi");
    setRoll(true);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 700);
  };

  const onTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectHour(selectedTime.getHours());
      setSelectMinute(selectedTime.getMinutes() + 7);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#FFFFFF', '#68a225']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      <View style={styles.discContainer}>
        <Animated.Image
          source={Disc}
          style={[styles.image, { transform: [{ rotate: spin }] }]}
        />
        <TouchableOpacity onPress={togglePlayPause} style={styles.playingButtonContainer}>
          <Image source={isPlayingSong ? Stop : Play} style={styles.setPlayingButton} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={toggleRoll}>
        <MaterialIcons name="arrow-right-alt" color={"black"} size={35} />
      </TouchableOpacity>
      <View style={styles.titleSongContainer}>
        <Text style={styles.titleSongText}>{currentSongContext?.title || "No song playing"}</Text>
      </View>
      <View style={styles.buttonSettingContainer}>
        <TouchableOpacity style={styles.buttonSetting}>
          <Image source={tenseconds} style={[styles.buttonSettingitems, { marginRight: 0 }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSetting} onPress={() => setFavor(!favor)}>
          <MaterialIcons name="star" size={32} color={favor ? "yellow" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowTimePicker(!showTimePicker)} style={[styles.buttonSetting, { backgroundColor: "transparent", width: 80, marginLeft: 40 }]}>
          <Image source={Clock} style={[styles.buttonSettingitems, { width: 50, height: 50 }]} />
          <Text style={styles.timerText}>{selectHour.toString().padStart(2, '0')}:{selectMinute.toString().padStart(2, '0')}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(0, 0, 0, selectHour, selectMinute)}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onTimeChange}
            themeVariant="light"
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 380,
    height: 380,
    position: "absolute",
    borderRadius: 100,
  },
  setPlayingButton: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  playingButtonContainer: {
    position: "absolute",
    padding: 80,
    borderRadius: 100,
  },
  titleSongContainer: {
    marginTop: 80,
    padding: 12,
    alignSelf: 'flex-start',
    marginHorizontal: 15,
  },
  titleSongText: {
    fontWeight: "bold",
    fontSize: 27,
    color: "black"
  },
  discContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: 300,
    marginTop: 90
  },
  nextButton: {
    borderWidth: 2,
    borderRadius: 80,
    borderColor: "black",
    height: 35,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonSettingContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "90%",
    height: 80,
    marginTop: 10,
  },
  buttonSetting: {
    backgroundColor: "#177e65",
    padding: 10,
    borderRadius: 100,
    marginHorizontal: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonSettingitems: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  timerText: {
    color: 'white',
    fontWeight: '600',
    width: 60,
    height: 20,
    marginLeft: 15
  }
});

export default Music;
