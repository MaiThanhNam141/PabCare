import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import GenderButtonSelect from './GenderButtonSelect';
import SliderSelect from './SliderSelect';
import CounterSelect from './CounterSelect';

const BMITest = ({ navigation }) => {
    // State
    const [formState, setFormState] = useState({});

    // Helpers
    const isButtonDisabled = () => {
        return !(formState.gender && formState.age && formState.height && formState.weight);
    };

    // Styles
    const btnStyle = {
        backgroundColor: isButtonDisabled() ? "#D3D3D3" : "#D83456",
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15
    };

    const btnTextStyle = {
        color: "white",
        fontSize: 20,
        textTransform: 'uppercase'
    };

    // Handlers
    const handleChange = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value
        }));
    };

    const handlePress = (value) => {
        setFormState((prevState) => ({
            ...prevState,
            gender: prevState.gender === value ? undefined : value
        }));
    };

    const calculateBmi = () => {
        let { weight, height } = formState;

        if (weight && height) {
            let heightMeters = height / 100;
            const bmiResult = (weight / (heightMeters * heightMeters)).toFixed(2);
            console.log(bmiResult);
            navigation.navigate(ScreenName.BMI_RESULT, { bmi: Number.parseInt(bmiResult) });
        }
    };

    return (
        <View style={styles.container}>
            {/* Inner Main container */}
            <View style={styles.inner}>
                {/* Gender Button Group */}
                <View style={{ gap: 10, flexDirection: 'row' }}>
                    <GenderButtonSelect
                        onPress={() => handlePress('male')}
                        selected={formState.gender === 'male'}
                    />
                    <GenderButtonSelect
                        gender='female'
                        onPress={() => handlePress('female')}
                        selected={formState.gender === 'female'}
                    />
                </View>

                {/* Height Slider */}
                <View style={{ marginVertical: '5%' }}>
                    <SliderSelect onValueChange={(value) => handleChange('height', value)} />
                </View>

                {/* Weight and Age Counters */}
                <View style={{ gap: 10, flexDirection: 'row' }}>
                    <CounterSelect
                        label='weight'
                        suffix='kg'
                        defaultValue={60}
                        onValueChange={(value) => handleChange('weight', value)}
                    />
                    <CounterSelect
                        label='age'
                        onValueChange={(value) => handleChange('age', value)}
                    />
                </View>

                {/* Button */}
                <View style={{ marginTop: '10%' }}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={btnStyle}
                        disabled={isButtonDisabled()}
                        onPress={calculateBmi}
                    >
                        <Text style={btnTextStyle}>
                            Calculate your BMI
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#080A1C",
        flex: 1,
        padding: '3%'
    },
    inner: {
        backgroundColor: "#0A0C21",
        flex: 1,
        padding: 10
    },
});

export default BMITest;
