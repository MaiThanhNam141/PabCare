import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const SliderSelect = ({ label = 'Chiều cao', suffix = 'cm', onValueChange }) => {
    const [displayValue, setDisplayValue] = useState(180);

    const handleChange = (value) => {
        setDisplayValue(value);
        onValueChange && onValueChange(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label.toUpperCase()}</Text>
            <Text style={styles.valueText}>
                {displayValue}
                <Text style={styles.label}> {suffix}</Text>
            </Text>
            <Slider
                style={{ width: '100%', height: 50 }}
                thumbTintColor="red"
                step={1}
                minimumValue={0}
                onValueChange={handleChange}
                maximumValue={300}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#888994"
                value={displayValue}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#faf8f7",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    label: {
        color: 'black',
        fontSize: 20,
        fontWeight: "600",
    },
    valueText: {
        color: "black",
        fontSize: 60,
        fontWeight: "600",
        marginBottom: '2%',
        borderWidth:0
    }
});

export default SliderSelect;
