import { View, Pressable, StyleSheet, Image } from "react-native";
import React from "react"

const MiniApp = ({navigation}) => {

    const imageSource = require("..//..//assets//pikachu.png")
    const handlePress = (link) => {
        navigation.navigate(link);
    };
    const componentData = [
        { componentName: 'Timer', imageSource: imageSource, link: 'focus' },
        { componentName: 'Todo List', imageSource: imageSource, link: 'todo' },
        { componentName: 'Diary', imageSource: imageSource, link:'diary' }

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
      borderRadius:30,
      height:100
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 10,
    },
  })