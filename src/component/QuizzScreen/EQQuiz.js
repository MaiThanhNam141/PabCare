import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const EQQuiz = () => {
    return (
        <View style={styles.container}>
            <Text>EQQuiz</Text>
        </View>
    );
};

export default EQQuiz;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});