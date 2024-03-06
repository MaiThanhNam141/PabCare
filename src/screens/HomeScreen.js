    import {View, StyleSheet, ScrollView } from "react-native"
    import React, { useState, useEffect } from "react"
    import ChatAI from "../component/ChatAI"
    import RenderSliderImage from "../component/RenderSliderImage"

    const HomeScreen = () => {
        const [images, setImages] = useState([]);
        const imageLink = require('..//..//assets//bg-image.jpg')
        useEffect(() => {
            fetchData();
        }, []);

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

        return(
            <ScrollView style={styles.container}>
                <ChatAI></ChatAI>
                <View style>
                    
                </View>
                <View style={styles.sliderImage}>
                    <RenderSliderImage images={images} />
                </View>
            </ScrollView>
        )
    }
    export default HomeScreen

    const styles = StyleSheet.create({
        container:{
            flex:1,
            //alignItems:"flex-start"
        },
        membership:{
            padding:15
        },
        sliderImage: {
          paddingHorizontal: 15,
          paddingVertical: 10,
          width:400,
          justifyContent: 'center', 
        },

    })