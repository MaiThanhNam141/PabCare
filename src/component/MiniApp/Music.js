import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, Image, Easing, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Disc, Play, Stop } from '../../data/Link';

const Music = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    );
    
    if (isPlaying) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
      spinValue.setValue(0);
    }

    return () => {
      spinAnimation.stop();
    };
  }, [isPlaying, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <LinearGradient style={styles.container} colors={['#FFFFFF', '#68a225']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      <Animated.Image
        source={Disc}
        style={[styles.image, { transform: [{ rotate: spin }] }]}
        onClick={() => setIsPlaying(false)}
      />
      {
        isPlaying ? 
        (
          <TouchableOpacity onPress={()=>setIsPlaying(false)} style={{padding:80, borderRadius:100}} >
            <Image source={Stop} style={styles.setPlayingButton}/>
          </TouchableOpacity>
        )
          : 
        (
          <TouchableOpacity onPress={()=>setIsPlaying(true)} style={{padding:80, borderRadius:100}} >
            <Image source={Play} style={styles.setPlayingButton}/>
          </TouchableOpacity>
        )
      }
    </LinearGradient>
  );
};

export default Music;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    position:'absolute',
    borderRadius:100,
  },
  setPlayingButton:{
    width:50,
    height:50
  },
});
