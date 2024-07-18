import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import SliderSelect from './SliderSelect';
import CounterSelect from './CounterSelect';
import GenderSelect from './GenderSelect'
import { updateUserInfo } from '../../feature/firebase/handleFirestore';

const BMITest = ({ navigation }) => {

    const [formState, setFormState] = useState({
        weight: 60,
        height: 180,
    });

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
            const bmiResult = (weight / (heightMeters * heightMeters)).toFixed(0);
            const weightPredict = ((heightMeters - 1) * 90).toFixed(0);
            navigation.navigate("bmiresult", { bmi: Number.parseInt(bmiResult), weight:Number.parseInt(weightPredict) });
            updateUserInfo({bmi:Number.parseInt(bmiResult)})
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={{ gap: 10, flexDirection: 'row' }}>
                    <GenderSelect
                        onPress={() => handlePress('male')}
                        selected={formState.gender === 'male'}
                    />
                    <GenderSelect
                        gender='Nữ'
                        onPress={() => handlePress('female')}
                        selected={formState.gender === 'female'}
                    />
                </View>

                <View style={{ marginVertical: '2%' }}>
                    <SliderSelect onValueChange={(value) => handleChange('height', value)} />
                </View>

                <View style={{ gap: 10, flexDirection: 'row' }}>
                    <CounterSelect
                        label='Cân nặng'
                        suffix='kg'
                        defaultValue={60}
                        onValueChange={(value) => handleChange('weight', value)}
                    />
                    <CounterSelect
                        label='Tuổi'
                        defaultValue={20}
                        onValueChange={(value) => handleChange('age', value)}
                    />
                </View>

                <View style={{ marginTop: '4%' }}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.btnStyle}
                        onPress={calculateBmi}
                    >
                        <Text style={styles.btnTextStyle}>
                            Tính BMI
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#bce0e3",
        flex: 1,
        padding: '3%'
    },
    inner: {
        backgroundColor: "#bce0e3",
        flex: 1,
        padding: 10
    },
    btnStyle:{
        backgroundColor:'#D83456',
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal:15,
    },
    btnTextStyle:{
        color: "white",
        fontSize: 20,
        textTransform: 'uppercase',
    }
});

export default BMITest;
