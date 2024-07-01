import React, {useEffect, useRef, useState} from 'react';
import { Text, View, StyleSheet, Animated, Image, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Disc } from '../../data/Link';

const Music = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => spin());
    };

    spin();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <LinearGradient style={styles.container} colors={['#FFFFFF', '#68a225']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
      <Animated.Image
          source={Disc}
          style={[styles.image, { transform: [{ rotate: spin }] }]}
        />
      {/* {!isPlaying ? 
        <Image
          source={Disc}
          style={styles.image}
        /> :
        <Animated.Image
          source={Disc}
          style={[styles.image, { transform: [{ rotate: spin }] }]}
        />
      } */}
    </LinearGradient>
  );
};

export default Music;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});