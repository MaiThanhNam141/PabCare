import React from 'react';
import BDI from '../../data/BDI';
import BDI2 from '../../data/BDI2';
import { Text, View, StyleSheet } from 'react-native';

const BDIQuiz = () => {
    return (
        <View style={styles.container}>
            <Text>BDIQuiz</Text>
        </View>
    );
};

export default BDIQuiz;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});