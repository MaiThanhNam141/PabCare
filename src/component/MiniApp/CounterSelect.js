import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CounterSelect = ({ label = 'Cân nặng', suffix, onValueChange, defaultValue = 0 }) => {
    const [displayValue, setDisplayValue] = useState(defaultValue);

    const handleAdd = () => {
        let newValue = displayValue + 1;
        onValueChange && onValueChange(newValue);
        setDisplayValue(newValue);
    };

    const handleSubtract = () => {
        if (displayValue > 0) {
            let newValue = displayValue - 1;
            onValueChange && onValueChange(newValue);
            setDisplayValue(newValue);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label.toUpperCase()}</Text>
            <Text style={styles.valueText}>
                {displayValue}
                {suffix && <Text style={styles.label}> {suffix}</Text>}
            </Text>
            <View style={styles.btnGroup}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btn}
                    onPress={handleSubtract}
                >
                    <MaterialIcons name="remove" size={40} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btn}
                    onPress={handleAdd}
                >
                    <MaterialIcons name="add" size={40} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        color: 'black',
        fontSize: 20,
        fontWeight: "600",
    },
    valueText: {
        color: "black",
        fontSize: 50,
        fontWeight: "600",
        marginBottom: '5%',
        paddingBottom: 40
    },
    btn: {
        backgroundColor: '#faf8f7',
        borderRadius: 100,
        alignItems: 'center',
        padding: 10,
        borderLeftWidth:1,
    },
    btnGroup: {
        flexDirection: 'row',
        gap: 20
    }
});

export default CounterSelect;
