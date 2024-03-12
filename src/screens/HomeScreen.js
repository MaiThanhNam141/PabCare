    import {View, StyleSheet, Image, Pressable } from "react-native"
    import React, { useState, useEffect } from "react"
    import ChatAI from "../component/ChatAI"
    import RenderSliderImage from "../component/RenderSliderImage"

    const HomeScreen = () => {
        const [images, setImages] = useState([]);
        const imageLink = require('..//..//assets//bg-image.jpg')
        useEffect(() => {
            fetchData();
        }, []);
        const Personal = ()=>{
            ToastAndroid.show('1', ToastAndroid.SHORT)
        }
          const Personal1W = ()=>{
            ToastAndroid.show('2', ToastAndroid.SHORT)
        }
          const Personal1M = ()=>{
            ToastAndroid.show('3', ToastAndroid.SHORT)
        }

        // const membershipData = [
        //     { membershipName: 'Hour', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalHour.png'), func: Personal },
        //     { membershipName: 'Week', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalWeek.png'), func: Personal1W },
        //     { membershipName: 'Month', imageSource: require('C://Users//ACER//OneDrive//Desktop//Resrource//personalMonth.png'), func: Personal1M }
    
        // ];

        const fetchData = async () => {
            try { 
                const response = await fetch('https://jsonplaceholder.typicode.com/photos');
                const jsonData = await response.json();
                const imageUrls = jsonData.slice(0, 4).map(item => item.url);
                setImages(imageUrls);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        return (
            <View style={styles.container}>
                <View style={styles.chatAI}>
                    <ChatAI />
                </View>
                {/* <View style={styles.membership}>
                    <View style={styles.memberBox}>
                        <Text style={styles.membershipText}>99.000 vnđ/giờ</Text>
                    </View>
                    <View style={styles.memberBox}>
                        <Text style={styles.membershipText}>499.000 vnđ/tuần</Text>
                    </View>
                    <View style={styles.memberBox}>
                        <Text style={styles.membershipText}>1.399.000 vnđ/tháng</Text>
                    </View>
                </View> */}
                {/* {membershipData.map((item, index) => (
                <Pressable
                    key={index}
                    onPress={() => handlePress(item.func)} 
                    style={styles.componentList}>
                    <Image source={item.imageSource} style={styles.image} />
                </Pressable>
                ))} */}
                <View style={styles.sliderImage}>
                    <RenderSliderImage images={images} />
                </View>
            </View>
        )
    }
    export default HomeScreen
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center'
        },
        membership: {
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20 // Add some space between membership and slider
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
        chatAI: {
            flex: 1
        }
    })