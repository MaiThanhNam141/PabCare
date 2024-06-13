import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, PermissionsAndroid, Linking, ActivityIndicator } from 'react-native';
import { goldensleep, bg2 } from '../../data/Link';
import { Picker } from '@react-native-picker/picker';
import messaging from '@react-native-firebase/messaging'

const GoldenSleep = () => {
    const [selectHour, setSelectHour] = useState(0);
    const [selectMinute, setSelectMinute] = useState(0);
    const [periodic, setPeriodic] = useState(5)
    const [hours, setHour] = useState(0)
    const [minutes, setMinute] = useState(0)

    const handleAlarm = async() => {
        try {
            const response = await messaging().sendMessage()({
                title: 'Báo thức',
                body: 'Get up pls',
                schedule: {
                    fireDate: new Date(Date.now() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000)).getTime(), // Thời gian được lấy từ state hours và minutes
                },
            });
            console.log('Scheduled notification: ', response);
        } catch (error) {
            console.error("Send messaging error: ", error)
        }
    }

    const renderPeriodic = (value, text) => {
        if (value === '4' || value === '5') {
          return text + ' ⭐'; 
        } else {
          return text;
        }
    };
    useEffect(()=>{
        const requestUserPermission = async() => {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                // console.log('Authorization status:', authStatus);
                const token = await messaging().getToken()
                console.log('FCM Token: ', token);
            }
        }
        requestUserPermission()
    }, [])

    useEffect(()=>{
        const timeToSleep = 15;
        const periodicTimes = 90;
        let totalMinutes = periodic*periodicTimes + timeToSleep + parseInt(selectHour)*60 + parseInt(selectMinute);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        if(hours >= 24)
            hours-=24;
        setHour(hours);
        setMinute(minutes)
    },[selectHour, selectMinute, periodic])

    const createArray = (length) => {
        const arr = Array.from({ length }, (_, i) => i.toString());
        return arr;
    };

    const AVAILABLE_HOURS = createArray(24);
    const AVAILABLE_MINUTES = createArray(60);

    return (
        <ImageBackground source={bg2} style={styles.container}>
            <View style={styles.gifContainer}>
                <Image source={goldensleep} style={styles.gifImage} resizeMode='contain'/>
            </View>
            <View>
                <View>
                    <Text style={styles.periodicTitle}>Giờ đi ngủ</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                          mode="dropdown"
                          style={styles.picker}
                          selectedValue={selectHour}
                          onValueChange={(itemValue) => {
                            setSelectHour(itemValue);
                          }}
                        >
                            {AVAILABLE_HOURS.map((value) => (
                                <Picker.Item key={value} label={value} value={value} style={styles.pickerItem} />
                            ))}
                        </Picker>
                        <Text style={styles.periodicTitle}> giờ </Text>
                        <Picker
                          mode="dropdown"
                          style={styles.picker}
                          selectedValue={selectMinute}
                          onValueChange={(itemValue) => {
                            setSelectMinute(itemValue);
                          }}
                        >
                            {AVAILABLE_MINUTES.map(value => (
                                <Picker.Item key={value} label={value} value={value} style={styles.pickerItem} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[styles.pickerContainer, {flexDirection:'column'}]}>
                        <Text style={styles.periodicTitle}>Chu kỳ giấc ngủ</Text>
                        <Picker
                          mode='dropdown'
                          style={[styles.picker, {width:310, marginTop:5}]}
                          selectedValue={periodic}
                          onValueChange={(itemValue) => {
                            setPeriodic(itemValue);
                          }}
                        >
                            <Picker.Item label={renderPeriodic('1', '1 Chu kỳ')} value={1} style={styles.pickerItem} key={1}/>
                            <Picker.Item label={renderPeriodic('2', '2 Chu kỳ')} value={2} style={styles.pickerItem} key={2}/>
                            <Picker.Item label={renderPeriodic('3', '3 Chu kỳ')} value={3} style={styles.pickerItem} key={3}/>
                            <Picker.Item label={renderPeriodic('4', '4 Chu kỳ')} value={4} style={styles.pickerItem} key={4}/>
                            <Picker.Item label={renderPeriodic('5', '5 Chu kỳ')} value={5} style={styles.pickerItem} key={5}/>
                        </Picker>
                    </View>
                </View>
                <Text style={styles.periodicTitle}>Giờ thức dậy tốt nhất</Text>
                <View style={styles.totalResult}>
                    <Text style={styles.totalResultText}>{hours} : {minutes} </Text>
                </View>
                <TouchableOpacity style={styles.setAlarm} onPress={()=>handleAlarm()}>
                    <Text style={styles.setAlarmText}>Đặt báo thức</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default GoldenSleep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    gifContainer:{
        width:321,
        height:242,
        alignItems:'center',
        justifyContent:'center',
        marginTop:35,
        marginBottom:20,
        borderWidth:1,
        borderRadius:20,
        backgroundColor:'#000',
        overflow:'hidden',
        paddingHorizontal:10
    },
    gifImage:{
        width:'100%',
        borderRadius:30
    },
    pickerContainer:{
        flexDirection: "row",
        alignItems: "center",
        marginTop:10,
    },
    picker:{
        width:130,
        height:60,
        color: "#000",
        backgroundColor: "#b1b3b0",
    },
    pickerItem: {
        color: "#000",
        backgroundColor: "#b1b3b0",
        fontSize: 18,
        textAlign:'center',
    },
    setAlarm:{
        backgroundColor:'#b1b3b0',
        width:127,
        height:31,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        borderWidth: StyleSheet.hairlineWidth,
        alignSelf:'center'
    },
    setAlarmText:{
        fontSize:12,
        fontWeight:'700'
    },
    periodicTitle:{
        color:'white',
        fontWeight:'600',
        fontSize:18,
        marginTop:10,
        alignSelf:'center'
    },
    totalResult:{
        backgroundColor:'#b1b3b0',
        width:188,
        height:80,
        marginVertical:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        alignSelf:'center'
    },
    totalResultText:{
        fontWeight:'bold',
        textAlign:'center',
        fontSize:28,
        color:'#000'
    }
});