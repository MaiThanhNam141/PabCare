import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { imageBG, miniAppIcon } from '../data/Link';

const MiniApp = ({ navigation }) => {

  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ImageBackground source={imageBG} style={styles.imageBackground}>
      <View style={styles.mainContainer}>
        <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('todo')}>
          <Image source={miniAppIcon.todoList} style={[styles.itemImg, styles.itemImgLarge]} />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={[styles.itemContainer, styles.itemHalfWidth]} onPress={() => goToScreen('diary')}>
            <Image source={miniAppIcon.diary} style={[styles.itemImg, styles.itemImgMedium]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemContainer, styles.itemHalfWidth]} onPress={() => goToScreen('bmi')}>
            <Image source={miniAppIcon.bmi} style={[styles.itemImg, styles.itemImgMedium]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => goToScreen('focus')}>
          <Image source={miniAppIcon.focus} style={[styles.itemImg, styles.itemImgLarge]} />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <View style={[styles.columnContainer, styles.columnWidth]}>
            <TouchableOpacity style={[styles.itemContainer, styles.itemSmall]} onPress={() => goToScreen('mood')}>
              <Image source={miniAppIcon.mood} style={styles.itemImg} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContainer, styles.itemSmall]} onPress={() => goToScreen('goldensleep')}>
              <Image source={miniAppIcon.goldensleep} style={styles.itemImg} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.itemContainer, styles.itemLarge]} onPress={() => goToScreen('music')}>
            <Image source={miniAppIcon.music} style={[styles.itemImg, styles.itemImgExtraLarge]} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#fafaf7',
    borderRadius: 15,
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  itemImg: {
    width: '100%',
    height: 75,
    resizeMode: 'contain',
  },
  itemImgLarge: {
    height: 129,
  },
  itemImgMedium: {
    height: 117,
  },
  itemImgExtraLarge: {
    height: 161,
  },
  itemHalfWidth: {
    width: '49%',
  },
  itemSmall: {
    height: 70,
    padding: 0,
    margin: 5,
  },
  itemLarge: {
    width: '50%',
    height: 150,
  },
  columnWidth: {
    width: '45%',
  },
});

export default MiniApp;
