import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const GoldenSleep = () => {
    return (
        <View style={styles.container}>
            <Text>GoldenSleep</Text>
        </View>
    );
};

export default GoldenSleep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});