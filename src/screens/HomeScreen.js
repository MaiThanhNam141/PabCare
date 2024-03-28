import {View, StyleSheet, Image, Pressable, Text } from "react-native"
import React, { useState, useEffect } from "react"
import ChatAI from "../component/ChatAI"
import RenderSliderImage from "../component/RenderSliderImage"


const HomeScreen = ({navigation}) => {
    const [images, setImages] = useState([]);
    const imageLink = require('..//..//assets//bg-image.jpg')

    // const membershipData = [
    //     { membershipName: 'Hour', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalHour.png'), func: Personal },
    //     { membershipName: 'Week', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalWeek.png'), func: Personal1W },
    //     { membershipName: 'Month', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalMonth.png'), func: Personal1M }

    // ];

    return (
        <View style={styles.container}>
            <ChatAI style={{flex:1}}/>
            
            {/* {membershipData.map((item, index) => (
            <Pressable
                key={index}
                onPress={() => handlePress(item.func)} 
                style={styles.componentList}>
                <Image source={item.imageSource} style={styles.image} />
            </Pressable>
            ))} */}
            {/* <View style={styles.sliderImage}>
                <RenderSliderImage images={images} />
            </View> */}

        </View>
    )
}
export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    membership: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20 
    },
    sliderImage: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center'
    },
    memberBox: {
        backgroundColor: '#54595F',
        padding: 10,
        borderRadius: 5
    },
    membershipText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})