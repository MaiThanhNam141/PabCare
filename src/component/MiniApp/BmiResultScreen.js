import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { resultHash } from "../../data/ressultBMI";

const BmiResultScreen = ({ route, navigation }) => {

    let params = route.params || {};
    let bmi = params.bmi || 30;
    let weight = params.weight;
    const getBmiDataKey = (bmi) => {
        switch (true) {
            case (bmi < 18.5):
                return 'a';
            case (bmi >= 18.5 && bmi <= 24.9):
                return 'b';
            case (bmi >= 25 && bmi <= 29.9):
                return 'c';
            default:
                return 'd';
        }
    };

    const bmiData = getBmiDataKey(bmi);

    // Styles
    const rangeHeaderStyle = {
        color: resultHash[bmiData].color, 
        fontSize: 24,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 2
    };

    // Handlers
    const handleRecalculate = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, {backgroundColor:resultHash[bmiData].backgroundColor}]}>
            <View style={[styles.inner, {backgroundColor:resultHash[bmiData].backgroundColor}]}>
                <Text style={styles.header}>Kết quả</Text>
                <View style={[styles.result, {backgroundColor: resultHash[bmiData].backgroundColor}]}>
                    <Text style={[rangeHeaderStyle]}>{resultHash[bmiData].type}</Text>
                    <Text style={styles.value}>{bmi}</Text>
                    <Text style={styles.rangeLabel}>
                        BMI {resultHash[bmiData].type}:
                    </Text>

                    <Text style={styles.rangeText}>
                        {resultHash[bmiData].range}
                    </Text>

                    <Text style={styles.description}>
                        {resultHash[bmiData].text}
                    </Text>
                    <Text style={[styles.description, {marginTop:0}]}>
                        Cân nặng nên hướng tới:<Text style={{fontWeight:'bold'}}>{weight}</Text>
                    </Text>
                </View>

                {/* Button */}
                <View style={{ marginTop: '5%' }}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.btnStyle}
                        onPress={handleRecalculate}
                    >
                        <Text style={styles.btnTextStyle}>
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '3%'
    },
    inner: {
        flex: 1,
        padding: 10
    },
    header: {
        color: 'black',
        fontSize: 40,
        fontWeight: '600',
        alignSelf:'center'
    },
    result: {
        flex: 1,
        marginVertical: '5%',
        borderRadius: 8,
        alignItems: 'center',
        paddingVertical: '10%'
    },
    btnStyle: {
        backgroundColor: "#D83456",
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15
    },
    btnTextStyle: {
        color: "white",
        fontSize: 18,
        textTransform: 'uppercase'
    },
    value: {
        color: "white",
        fontSize: 88,
        fontWeight: '700',
        marginVertical: '7%'
    },
    rangeLabel: {
        color: '#8E8E98',
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.75
    },
    rangeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.75,
        marginTop: '3%'
    },
    description: {
        color: 'white',
        fontSize: 18,
        letterSpacing: 0.75,
        marginTop: '13%',
        textAlign: 'center'
    }
});

export default BmiResultScreen;
