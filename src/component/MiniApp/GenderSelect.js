import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GenderSelect = ({ selected, gender = 'male', onPress }) => {

    const selectedStyle = {
        color: 'white'
    };

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.container}
            onPress={onPress}
        >
            {
                gender === 'male' ?
                    <MaterialIcons name="male" size={75} color={selected ? 'white' : '#8E8E98'} />
                    :
                    <MaterialIcons name="female" size={75} color={selected ? 'white' : '#8E8E98'} />
            }
            <Text style={[styles.label, selected && selectedStyle]}>
                {gender.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1D1F32",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1
    },

    label: {
        color: '#8E8E98',
        fontSize: 20,
        fontWeight: "600",
    }
});

export default GenderSelect;
