import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { arrow, arrowdisable, note } from '../../data/Link';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDiary, setDiary } from '../../feature/firebase/handleFirestore';

const Diary = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [diaryTotal, setDiaryTotal] = useState('');
    const [diaryText, setDiaryText] = useState('');
    const [isDisableTomorrow, setIsDisableTomorrow] = useState(true);
    const [isDisableYesterday, setIsDisableYesterday] = useState(false);
    const [disableEntry, setDisableEntry] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // state để theo dõi trạng thái loading

    const formatDate = (date) => {
        const dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    useEffect(() => {
        const fetchDiaryEntry = async () => {
            try {
                const diaryDoc = await getDiary(); 
                if (diaryDoc) {
                    setDiaryTotal(diaryDoc);
                } 
            } catch (error) {
                console.log("Fetch Diary:" , error);
            } finally {
                setIsLoading(false); 
            }
        };
        fetchDiaryEntry();
    }, []);

    useEffect(() => {
        const checkButtons = () => {
            const firstDate = new Date(2024, 7, 2);
            setIsDisableTomorrow(selectedDate.toDateString() === today.toDateString());
            setIsDisableYesterday(selectedDate <= firstDate);
            selectedDate.toDateString() !== today.toDateString() ? setDisableEntry(true) : setDisableEntry(false);
        };
        const setEachDiary = () => {
            if (diaryTotal){
                const dateStr = formatDate(selectedDate).replace(/\//g, '-');
                const diaryTextIndex = diaryTotal.findIndex(index => index.id === dateStr);
                if(diaryTextIndex !== -1) {
                    setDiaryText(diaryTotal[diaryTextIndex].text);
                } else {
                    setDiaryText(''); 
                }
            }
        };
        checkButtons();
        setEachDiary();
    }, [selectedDate, diaryTotal]);

    const saveDiaryEntry = async () => {
        try {
            if(!diaryText.trim() || diaryText.length < 10){
                ToastAndroid.show("Quá ngắn", ToastAndroid.SHORT);
                return 0;
            }
            const dateStr = formatDate(selectedDate).replace(/\//g, '-');
            setDiary(dateStr, diaryText.trim());
            ToastAndroid.show("Lưu thành công", ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show("Lưu thất bại, vui lòng kiểm tra lại mạng", ToastAndroid.SHORT);
            console.log("save diary: ", error);
        }
    };

    const disableEntryFunction = useCallback(() => {
        if (disableEntry){
            ToastAndroid.show("Chỉ có thể thay đổi nhật ký ngày hôm nay", ToastAndroid.SHORT);
        }      
    }, [disableEntry]);

    const onDateChange = (_, date) => {
        const selected = date || selectedDate;
        setShowCalendar(false);
        setSelectedDate(selected);
    };

    const previousDay = () => {
        if (!isDisableYesterday) {
            const prevDate = new Date(selectedDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setSelectedDate(prevDate);
        }
    };

    const nextDay = () => {
        if (!isDisableTomorrow) {
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setSelectedDate(nextDate);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#87bc9d" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerTitle}>
                <View style={styles.divider} />
                <Text style={styles.title}>Nhật ký và biết ơn</Text>
                <View style={styles.divider} />
            </View>
            <TouchableOpacity style={styles.mainContainer} onPress={disableEntryFunction}>
                <Image source={note} style={styles.noteImage} />
                <TextInput
                    style={styles.textInput}
                    value={diaryText}
                    onChangeText={setDiaryText}
                    editable={!disableEntry}
                />
            </TouchableOpacity>
            <View style={styles.navigateContainer}>
                <TouchableOpacity onPress={previousDay} disabled={isDisableYesterday}>
                    <Image source={isDisableYesterday ? arrowdisable : arrow} style={[styles.arrowImage, { transform: [{ rotate: '180deg' }] }]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateTime} onPress={() => setShowCalendar(true)}>
                    <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextDay} disabled={isDisableTomorrow}>
                    <Image source={isDisableTomorrow ? arrowdisable : arrow} style={styles.arrowImage} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={saveDiaryEntry} style={[styles.dateTime, {marginTop:-150}]}>
                <Text style={styles.dateTimeText}>Lưu</Text>
            </TouchableOpacity>

            {showCalendar && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="calendar"
                    onChange={onDateChange}
                />
            )}
        </SafeAreaView>
    );
};

export default Diary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        backgroundColor: '#87bc9d',
        height: 3,
        flex: 1,
        alignSelf: "center",
    },
    headerTitle:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        paddingTop: 5,
        marginTop:25,
    },
    title: {
        fontSize: 12,
        fontWeight: "700",
        color: '#fafaf7',
        paddingHorizontal: 50,
        paddingVertical:10,
        borderRadius:35,
        backgroundColor:'#87bc9d',
    },
    mainContainer:{
        width:350,
        height:300,
    },
    noteImage:{
        width:350,
        height:300,
        resizeMode:'contain',
        overflow:'hidden',
        position:'absolute',
    },
    textInput:{
        top:50,
        width:270,
        height:250,
        position:'absolute',
        alignSelf:'center',
        textAlignVertical:'top',
        textAlign:'justify',
    },
    arrowImage:{
        width:40,
        height:40,
        resizeMode:'contain'
    },
    navigateContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:30
    },
    dateTime:{
        backgroundColor:'#87bc9d',
        paddingHorizontal:15,
        paddingVertical:5,
        borderRadius:100,
        width:200,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    dateTimeText:{
        color:'#fff',
        fontSize:18,
        fontWeight:'700',
    },
    
});
