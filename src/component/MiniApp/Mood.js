import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Mood = () => {
  const [currentEmoji, setCurrentEmoji] = useState('');
  const currentDate = new Date().toISOString().slice(0, 10);

  const dataEmotions = [
    { id: 0, name: 'sentiment-very-dissatisfied', color: '#d60b0b' },
    { id: 1, name: 'sentiment-dissatisfied', color: '#de7123' },
    { id: 2, name: 'sentiment-neutral', color: '#0d0d0c' },
    { id: 3, name: 'sentiment-savtisfied', color: '#11e5f0' },
    { id: 4, name: 'sentiment-very-satisfied', color: '#53f037' }
  ];

  const renderEmotions = ({ item }) => (
    <TouchableOpacity style={styles.emotionContainer} onPress={() => setEmoji(item)}>
      <MaterialIcons name={item.name} size={34} color={item.color} />
    </TouchableOpacity>
  );
  
  const renderCustomDay = (date) => {
    if (date.dateString === currentDate && currentEmoji) {
      return (
        <View style={styles.customDayContainer}>
          <MaterialIcons name={currentEmoji.name} size={24} color={currentEmoji.color} />
        </View>
      );
    }
    return date.day.toString();
  };

  const getMarkedDates = () => {
    const markedDates = {};
    if (currentEmoji) {
      markedDates[currentDate] = {
        customStyles: {
          container: { backgroundColor: 'transparent' },
          text: { display: 'none' }
        }
      };
    }
    return markedDates;
  };

  const setEmoji = (item) => {
    setCurrentEmoji(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar 
        markingType={'custom'}
        markedDates={getMarkedDates()}
        getDayComponent={(date) => renderCustomDay(date)}
      />
      <View style={styles.mainContainer}>
        <FlatList
          data={dataEmotions}
          renderItem={renderEmotions}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </SafeAreaView>
  )
};

export default Mood;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 75,
    backgroundColor: '#f5f5f5',
  },
  flatListContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  emotionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 100,
  },
});
