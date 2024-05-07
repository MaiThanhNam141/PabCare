import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Music = () => {
  return (
    <View style={styles.container}>
      <Text>Music</Text>
    </View>
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