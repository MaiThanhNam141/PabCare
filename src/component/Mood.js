import React from "react";
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Mood = () => {
  const dataEmotions = [
    { id: 0, title:'Tức giận', name: 'sentiment-very-dissatisfied', color: '#d60b0b'},
    { id: 1, title: 'Không Vui', name: 'sentiment-dissatisfied', color: '#de7123' },
    { id: 2, title: 'Bình thường', name: 'sentiment-neutral', color: '#0d0d0c' },
    { id: 3, title: 'Vui vẻ', name: 'sentiment-satisfied', color: '#11e5f0' },
    { id: 4, title: 'Hạnh phúc', name: 'sentiment-very-satisfied', color: '#53f037'}
  ];

  const renderEmotions = ({ item }) => (
    <TouchableOpacity style={styles.emotionContainer}>
      <MaterialIcons name={item.name} size={36} color={item.color}/>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Calendar />
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
    flexDirection:'row'
  },
  emotionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop:25,
    borderRadius:100,
  },
});