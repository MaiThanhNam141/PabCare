import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { goldensleep, goldenSleepBackGround } from '../../data/Link';
import PushNotification from 'react-native-push-notification';
import { CHANNEL_ID } from '../../data/Link';

const GoldenSleep = () => {
    const [selectHour, setSelectHour] = useState(0);
    const [selectMinute, setSelectMinute] = useState(0);
    const [periodic, setPeriodic] = useState(5);
    const [hours, setHour] = useState(0);
    const [minutes, setMinute] = useState(0);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleAlarm = async () => {
        try {
            const notificationTime = new Date();
            notificationTime.setHours(notificationTime.getHours() + hours + 7); 
            notificationTime.setMinutes(minutes);
            notificationTime.setSeconds(0);
            notificationTime.setMilliseconds(0);
            
            PushNotification.localNotificationSchedule({
                channelId: CHANNEL_ID,
                title: 'Báo thức',
                message: 'Get up pls',
                date: notificationTime,
                allowWhileIdle: true,
                playSound: true,
                soundName: 'default',
                repeatType: 'none', 
            });
            console.log("Notification scheduled at:", notificationTime);
        } catch (error) {
            console.error("Send messaging error: ", error);
        }
    };

    const renderPeriodic = (value, text) => {
        if (value === '4' || value === '5') {
            return text + ' ⭐';
        } else {
            return text;
        }
    };

    useEffect(() => {
        const requestUserPermission = async () => {
            try {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                await PushNotification.cancelAllLocalNotifications();
            } catch (error) {
                console.error("GoldenSleep.requestUserPermission Error ", error);
            }
            
        };
        requestUserPermission();
    }, []);

    useEffect(() => {
        const timeToSleep = 15;
        const periodicTimes = 90;
        let totalMinutes = periodic * periodicTimes + timeToSleep + parseInt(selectHour) * 60 + parseInt(selectMinute);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        if (hours >= 24)
            hours -= 24;
        setHour(hours);
        setMinute(minutes);
    }, [selectHour, selectMinute, periodic]);

    const onTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setShowTimePicker(!showTimePicker);
            setSelectHour(selectedTime.getHours());
            setSelectMinute(selectedTime.getMinutes());
        }
    };

    return (
        <ImageBackground source={goldenSleepBackGround} style={styles.container}>
            <View style={styles.gifContainer}>
                <Image source={goldensleep} style={styles.gifImage} resizeMode='contain' />
            </View>
            <View>
                <View>
                    <TouchableOpacity onPress={()=>setShowTimePicker(!showTimePicker)} onTouchCancel={()=>setShowTimePicker(!showTimePicker)} style={styles.dateTimePicker}>
                        <Text style={styles.periodicTitle}>Chọn giờ đi ngủ</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={new Date(0, 0, 0, selectHour, selectMinute)}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={onTimeChange}
                            themeVariant="light"
                        />
                    )}

                    <View style={[styles.pickerContainer, { flexDirection: 'column' }]}>
                        <Text style={styles.periodicTitle}>Chu kỳ giấc ngủ</Text>
                        <Picker
                            mode='dropdown'
                            style={[styles.picker, { width: 310, marginTop: 5 }]}
                            selectedValue={periodic}
                            onValueChange={(itemValue) => {
                                setPeriodic(itemValue);
                            }}
                        >
                            <Picker.Item label={renderPeriodic('1', '1 Chu kỳ')} value={1} style={styles.pickerItem} key={1} />
                            <Picker.Item label={renderPeriodic('2', '2 Chu kỳ')} value={2} style={styles.pickerItem} key={2} />
                            <Picker.Item label={renderPeriodic('3', '3 Chu kỳ')} value={3} style={styles.pickerItem} key={3} />
                            <Picker.Item label={renderPeriodic('4', '4 Chu kỳ')} value={4} style={styles.pickerItem} key={4} />
                            <Picker.Item label={renderPeriodic('5', '5 Chu kỳ')} value={5} style={styles.pickerItem} key={5} />
                        </Picker>
                    </View>
                </View>
                <Text style={styles.periodicTitle}>Giờ thức dậy tốt nhất</Text>
                <View style={styles.totalResult}>
                    <Text style={styles.totalResultText}>{hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')}</Text>
                </View>
                <TouchableOpacity style={styles.setAlarm} onPress={() => handleAlarm()}>
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
    gifContainer: {
        width: 321,
        height: 242,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#000',
        overflow: 'hidden',
        paddingHorizontal: 10
    },
    gifImage: {
        width: '100%',
        borderRadius: 30
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    picker: {
        width: 130,
        height: 60,
        color: "#000",
        backgroundColor: "#b1b3b0",
    },
    pickerItem: {
        color: "#000",
        backgroundColor: "#b1b3b0",
        fontSize: 18,
        textAlign: 'center',
    },
    setAlarm: {
        backgroundColor: '#b1b3b0',
        width: 127,
        height: 31,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        borderWidth: StyleSheet.hairlineWidth,
        alignSelf: 'center'
    },
    setAlarmText: {
        fontSize: 12,
        fontWeight: '700'
    },
    dateTimePicker:{
        borderWidth:1,
        height:80,
        justifyContent:'center',
        borderRadius:50,
        backgroundColor:'rgba(177, 179, 176, 0.6)',
        paddingBottom:5
    },
    periodicTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
        marginTop: 10,
        alignSelf: 'center'
    },
    totalResult: {
        backgroundColor: '#b1b3b0',
        width: 188,
        height: 80,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        alignSelf: 'center'
    },
    totalResultText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 28,
        color: '#000'
    },

    timePickerButton: {
        color: 'blue',
        fontWeight: '600',
        fontSize: 18,
        alignSelf: 'center',
        marginTop: 10
    }
});
