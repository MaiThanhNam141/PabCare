import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GenderSelect = ({ selected, gender = 'Nam', onPress }) => {

    const selectedStyle = {
        color: 'black'
    };

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.container}
            onPress={onPress}
        >
            {
                gender === 'Nam' ?
                    <MaterialIcons name="male" size={75} color={selected ? 'black' : '#c2c0c0'} />
                    :
                    <MaterialIcons name="female" size={75} color={selected ? 'black' : '#c2c0c0'} />
            }
            <Text style={[styles.label, selected && selectedStyle]}>
                {gender.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );
};

export default GenderSelect
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#faf8f7",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1
    },

    label: {
        color: '#c2c0c0',
        fontSize: 20,
        fontWeight: "600",
    }
});

