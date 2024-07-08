import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getUserDocumentRef } from '../../feature/firebase/handleFirestore';

const Mood = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [currentEmoji, setCurrentEmoji] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = getUserDocumentRef();
        if (userDocRef) {
          const snapshot = await userDocRef.collection('calendar').get();
          const dates = {};
          snapshot.forEach(doc => {
            const data = doc.data();
            dates[doc.id] = { emoji: data.emoji };
          });
          setMarkedDates(dates);
        }
      } catch (error) {
        console.error("Fetch data error: ", error);
      }
    };
    fetchData();
  }, []);

  const dataEmotions = [
    { id: 0, name: '😠' },
    { id: 1, name: '🙁' },
    { id: 2, name: '🙂' },
    { id: 3, name: '😊' },
    { id: 4, name: '😍' }
  ];

  const submitEmotions = async (date, emoji) => {
    try {
      const userDocRef = getUserDocumentRef();
      if (userDocRef) {
        await userDocRef.collection('calendar').doc(date).set({ emoji });
      }
    } catch (error) {
      console.error("Mood.submitEmotions Error: ", error);
    }
  };

  const setEmoji = (item) => {
    setCurrentEmoji(item);
    setMarkedDates(prev => ({
      ...prev,
      [currentDate]: {
        customStyles: {
          container: { backgroundColor: 'transparent' },
          text: { color: 'transparent' },
        },
        emoji: item.name
      }
    }));
    submitEmotions(currentDate, item.name); // Gửi dữ liệu lên Firebase không đồng bộ
  };

  const renderEmotions = ({ item }) => (
    <TouchableOpacity style={styles.emotionContainer} onPress={() => setEmoji(item)}>
      <Text style={styles.emotions}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCustomDay = ({ date, state }) => {
    const dateString = date.dateString;
    const dayEmoji = markedDates[dateString]?.emoji || '';
    return (
      <View style={styles.customDayContainer}>
        <Text style={[styles.emotions, { fontSize: dayEmoji ? 17 : 14, marginTop: dayEmoji ? -10 : 0 }]}>
          {dayEmoji || date.day}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar 
        markingType={'custom'}
        markedDates={markedDates}
        dayComponent={renderCustomDay}
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
  );
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
    marginTop: 15,
    borderRadius: 100,
  },
  emotions: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  customDayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
  },
});
