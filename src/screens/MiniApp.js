import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { imageBG } from '../data/Link';

const MiniApp = ({ navigation }) => {

  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBG} style={styles.imageBackground}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('todo')}>
            <Text style={styles.itemText}>Todo List</Text>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={[styles.itemContainer, {width:'49%'}]} onPress={() => goToScreen('focus')}>
              <Text style={styles.itemText}>Focus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContainer, {width:'49%'}]} onPress={() => goToScreen('bmi')}>
              <Text style={styles.itemText}>Thể trạng</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('diary')}>
            <Text style={styles.itemText}>Viết biết ơn</Text>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <View style={[styles.columnContainer, {width:'45%'}]}>
              <TouchableOpacity style={[styles.itemContainer, {width:'100%', height:70, padding:5, margin: 5}]} onPress={() => goToScreen('mood')}>
                <Text style={styles.itemText}>Tâm trạng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.itemContainer, {width:'100%', height:70, padding:5, margin: 5}]} onPress={() => goToScreen('music')}>
                <Text style={styles.itemText}>Music</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.itemContainer, {width:'50%', height:150}]} onPress={() => goToScreen('goldensleep')}>
              <Text style={styles.itemText}>Giờ ngủ vàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fafaf7',
    borderRadius: 25,
    width: '100%',
    height: '85%',
    alignSelf: 'flex-end',
    marginTop: '20%',
  },
  itemContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ebedeb',
    borderRadius: 15,
  },
  itemText: {
    fontSize: 16,
    fontWeight:'500'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 25,
    alignItems: 'center'
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
});

export default MiniApp;
