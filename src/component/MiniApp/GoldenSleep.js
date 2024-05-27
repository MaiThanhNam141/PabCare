import React from 'react';
import { Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { goldensleep, imageBG } from '../../data/Link';

const GoldenSleep = () => {
    return (
        <ImageBackground source={imageBG} style={styles.container}>
            <View style={styles.gifContainer}>
                <Image source={goldensleep} style={styles.gifImage} resizeMode='contain'/>
            </View>
        </ImageBackground>
    );
};

export default GoldenSleep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    gifContainer:{
        width:300,
        height:300,
        borderRadius:30,
        borderWidth:3,
        alignItems:'center',
        justifyContent:'center'
    },
    gifImage:{
        width:'100%'
    }
});