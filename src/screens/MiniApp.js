import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Alert, Image } from 'react-native';
import { imageBG, miniAppIcon } from '../data/Link';

const MiniApp = ({ navigation }) => {

  const goToScreen = (screenName) => {
    try {
      if(screenName==='diary'){
        Alert.alert('Lỗi',"Tính năng đang phát triển")
        return;
      }
      navigation.navigate(screenName);
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <ImageBackground source={imageBG} style={styles.imageBackground}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('todo')}>
            <Image source={miniAppIcon.todoList} style={[styles.itemImg, {height:129}]} />
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={[styles.itemContainer, {width:'49%'}]} onPress={() => goToScreen('diary')}>
              <Image source={miniAppIcon.diary} style={[styles.itemImg, { height: 117 }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContainer, {width:'49%'}]} onPress={() => goToScreen('bmi')}>
              <Image source={miniAppIcon.bmi} style={[styles.itemImg, { height: 117 }]} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('focus')}>
            <Image source={miniAppIcon.focus} style={[styles.itemImg, {height:129}]} />
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <View style={[styles.columnContainer, {width:'45%'}]}>
              <TouchableOpacity style={[styles.itemContainer, { height:70, padding:0, margin: 5}]} onPress={() => goToScreen('mood')}>
                <Image source={miniAppIcon.mood} style={styles.itemImg}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.itemContainer, {height:70, padding:0, margin: 5}]} onPress={() => goToScreen('goldensleep')}>
                <Image source={miniAppIcon.goldensleep} style={styles.itemImg} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.itemContainer, {width:'50%', height:150}]} onPress={() => goToScreen('music')}>
              <Image source={miniAppIcon.music} style={[styles.itemImg, {height:161}]} />
            </TouchableOpacity>
          </View>
        </View>
    </ImageBackground>
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
    backgroundColor: '#FBFBF9',
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
    borderWidth:0,
    backgroundColor: '#fafaf7',
    borderRadius: 15,
    marginTop:5
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
  itemImg:{
    width: '100%',
    height: 75,
    resizeMode:'contain',
    borderRadius: 0,
  }
});

export default MiniApp;
