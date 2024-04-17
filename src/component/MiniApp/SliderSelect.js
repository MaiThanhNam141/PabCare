import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const SliderSelect = ({ label = 'Height', suffix = 'cm', onValueChange }) => {
    const [displayValue, setDisplayValue] = useState(0);

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
                style={{ width: '100%', height: 400 }}
                thumbTintColor="#D83456"
                step={1}
                minimumValue={0}
                onValueChange={handleChange}
                maximumValue={300}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#888994"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#111426",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        color: '#8E8E98',
        fontSize: 20,
        fontWeight: "600",
    },
    valueText: {
        color: "white",
        fontSize: 60,
        fontWeight: "600",
        marginBottom: '5%'
    }
});

export default SliderSelect;
