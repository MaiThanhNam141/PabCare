import React, {useState, useRef} from "react"
import { View, Pressable, StyleSheet, Text, Animated, Image } from "react-native";

const MiniApp = ({navigation}) => {

    const [pressIndex, setPressIndex] = useState(null)

    const imageSourceFocus = require("..//..//assets//Icons//Focus.png")
    const imageSourceTodo = require("..//..//assets//Icons//TodoAvatar.png")
    const imageSourceDiary = require("..//..//assets//Icons//Diary1.png")

    const handlePress = (link) => {
        navigation.navigate(link);
    };

    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = (index) => {
        setPressIndex(index)
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setPressIndex(null);
        });
    };

    const componentData = [
        { componentName: 'Focus', imageSource: imageSourceFocus, link: 'focus' },
        { componentName: 'Todo List', imageSource: imageSourceTodo, link: 'todo' },
        { componentName: 'Diary', imageSource: imageSourceDiary, link:'diary' }

    ];

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image style={styles.logo} source={require("..//..//assets//Icons//Logo.png")}></Image>
                <Text style={styles.title}>Mini <Text style={{color:"#4dc9c1", fontWeight:"bold"}}>Apps</Text></Text>
            </View>
            {componentData.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handlePress(item.link)}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut()}
                  style={[
                    styles.componentList,
                    {
                        backgroundColor: pressIndex === index ? "#dedfe0" : "transparent",
                    }
                  ]}>
                    <View style={styles.imageBackground}>
                        <Animated.Image
                            source={item.imageSource}
                            style={[styles.image, { transform: [{ scale: scaleValue._value }] }]}
                        />
                    </View>
                    <Text style={styles.componentName}>{item.componentName}</Text>
                </Pressable>
            ))}
        </View>
    );
    
    
}
export default MiniApp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    componentList: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: 130,
        width: 130,
        paddingHorizontal:10,
        borderRadius:50,
        marginTop: 20
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderRadius: 50,
    },
    componentName: {
        marginTop: 5,
        fontSize: 20,
    },
    imageBackground:{
        width: 110,
        height: 110,
        paddingTop: 20,
        justifyContent:'flex-end',
        alignItems:'center',
    },

    titleContainer:{
        marginHorizontal: 40,
        marginBottom: 100,
        alignItems:"center"
    },

    title:{
        fontWeight:'500',
        color:"#fcbd79",
        fontSize: 42,
    },

    logo:{
        width:250,
        height:250,
        resizeMode:"contain",
    }
  })