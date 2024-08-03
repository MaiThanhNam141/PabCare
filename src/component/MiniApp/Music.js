import React, { useEffect, useContext, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, Image, Easing, TouchableOpacity, Alert, AppState, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Disc, Play, Stop } from '../../data/Link';
import { MusicContext } from '../../feature/context/MusicContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateUserInfo, getUserInfo } from '../../feature/firebase/handleFirestore';

const Music = () => {
  const { currentSongContext, isPlayingSong, setIsPlayingSong, setRoll } = useContext(MusicContext);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [favor, setFavor] = useState(true);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef(null);
  const favorRef = useRef(null);

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
    const updateFavor = async () => {
      try {
        if (favor && currentSongContext?.title !== favorRef.current) {
          updateUserInfo({ favor: currentSongContext?.title });
          favorRef.current = currentSongContext?.title;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        updateFavor();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    subscription.remove();  
    updateFavor();
  };
  }, [favor]);
  
  useEffect(() => {
    const getFavor = async () => {
      try {
        const snapshot = await getUserInfo();
        if (snapshot) {
          favorRef.current = snapshot.favor || "Track1";
        }
      } catch (error) {
        setFavor(false);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy thông tin người dùng.");
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    };
    getFavor();
  }, []);

  useEffect(() => {
      if (currentSongContext?.title) {
        setFavor(currentSongContext?.title === favorRef.current);
        if(!favorRef.current){
          setFavor(true)
        }
      }
  }, [currentSongContext]);

  const togglePlayPause = () => {
    if (isButtonDisabled) {
      Alert.alert("Lỗi", "Bạn bấm quá nhanh sẽ gây ra lỗi");
      return;
    }

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
    if (isButtonDisabled) {
      if (!isAlertVisible) {
        setIsAlertVisible(true);
        Alert.alert(
          "Lỗi",
          "Bạn bấm quá nhanh sẽ gây ra lỗi",
          [{ text: "OK", onPress: () => setIsAlertVisible(false) }],
          { cancelable: false }
        );
      }
      return;
    }
    
    setRoll(true);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 700);
  };

  const toggleFavor = () => {
    if (isButtonDisabled) return;
    setFavor(!favor);
  }

  if (loading){
    return (
      <View style={{flex:1}}>
        <ActivityIndicator size={'large'} color={'#87bc9d'}/>
      </View>
    )
  }

  return (
    <LinearGradient style={styles.container} colors={['#FFFFFF', '#68a225']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      <View style={styles.discContainer}>
        <Animated.Image
          source={Disc}
          style={[styles.image, { transform: [{ rotate: spin }] }]}
        />
        <TouchableOpacity 
          onPress={togglePlayPause} 
          style={styles.playingButtonContainer}
          disabled={isButtonDisabled}
        >
          <Image source={isPlayingSong ? Stop : Play} style={styles.setPlayingButton} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={toggleRoll} 
        disabled={isButtonDisabled}
      >
        <MaterialIcons name="arrow-right-alt" color={"black"} size={35} />
      </TouchableOpacity>
      <View style={styles.titleSongContainer}>
        <Text style={styles.titleSongText}>{currentSongContext?.title || "No song playing"}</Text>
      </View>
      <View style={styles.buttonSettingContainer}>
        <TouchableOpacity 
          style={styles.buttonSetting} 
          onPress={toggleFavor}
          disabled={isButtonDisabled}
        >
          <MaterialIcons name="star" size={32} color={favor ? "yellow" : "black"} />
        </TouchableOpacity>
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
});

export default Music;
