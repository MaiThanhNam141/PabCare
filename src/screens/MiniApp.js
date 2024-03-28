import { View, Pressable, StyleSheet, Image } from "react-native";
import React from "react"

const MiniApp = ({navigation}) => {

    const imageSourceFocus = require("..//..//assets//Icons//FocusAvatar.png")
    const imageSourceTodo = require("..//..//assets//Icons//TodoAvatarVersion2.png")
    const imageSourceDiary = require("..//..//assets//Icons//Diary2.png")
    const handlePress = (link) => {
        navigation.navigate(link);
    };
    const componentData = [
        { componentName: 'Timer', imageSource: imageSourceFocus, link: 'focus' },
        { componentName: 'Todo List', imageSource: imageSourceTodo, link: 'todo' },
        { componentName: 'Diary', imageSource: imageSourceDiary, link:'diary' }

    ];

    return(
        <View>
            {componentData.map((item, index) => (
                <Pressable
                    key={index}
                    onPress={() => handlePress(item.link)} 
                    style={styles.componentList}>

                    <Image source={item.imageSource} style={styles.image} />
                </Pressable>
            ))}
        </View>
    )
}
export default MiniApp

const styles = StyleSheet.create({
    componentList:{
      margin:20,
      alignItems:"center",
      justifyContent:"center",
      height:175
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 30,
    },
  })