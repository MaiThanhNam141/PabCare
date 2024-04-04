import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFirestoreDiary from "../feature/firebase/useFirestoreDiary";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DiaryModal from "./DiaryModal";

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const Diary = () => {
    const [userDiary, setUserDiary] = useState([]);
    const [items, setItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false)

    const {getDiary, addDiary, updateDiary} = useFirestoreDiary()

    useEffect(() => {
        const initializeFirebase = async () => {
          try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
              const user = JSON.parse(userData)
              setUser(user.displayName)
              getDiaryFireStore();  
            }
          } catch (error) {
            console.error("Error initializing Firestore in Diary:", error);
          }
        };
        
        const loadItem = () => {
            const today = new Date();
            loadItems({ timestamp: today.getTime() });
        }

        initializeFirebase();
        loadItem()
      }, []);

    const loadItems = async (day) => {
        const newItems = { ...items };
        try {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!newItems[strTime]) {
                    newItems[strTime] = [];
                }
            }
            
            userDiary.forEach(todoItem => {
                const time = new Date(todoItem.timestamp);
                const strTime = timeToString(time);
                if (!newItems[strTime]) {
                    newItems[strTime] = [];
                }

                newItems[strTime].push({
                    name: todoItem.name,
                    height: todoItem.height
                });
            });
            
            setItems(newItems);
        } catch (error) {
            console.error('Error loading items: ', error);
        }
    };


    const getDiaryFireStore = async () => {
        try {
            const diary = await getDiary()
            setUserDiary(diary)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddModal = () => {

    }

    const renderItem = (item) => {
        return (
          <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
            <Card>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text>{item.name}</Text>
                  <Avatar.Text label="J" />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                items={userDiary.length > 0 ? items : { "Rảnh rỗi": [] }}
                loadItemsForMonth={loadItems}
                selected={timeToString(new Date())}
                renderItem={renderItem}
            />
            <View style={{ marginVertical: 48 }}>
                <Modal animationType="slide" visible={modalVisible} onRequestClose={()=> setModalVisible(!modalVisible)}>
                    <DiaryModal closeModal={()=>setModalVisible(!modalVisible)} addDiary={handleAddModal}/>
                </Modal>
                <TouchableOpacity style={styles.add} onPress={()=>setModalVisible(!modalVisible)}>
                    <MaterialIcons name="add" size={16} color={'#24A6D9'} />
                </TouchableOpacity>
                <Text style={styles.add}>Add List</Text>
            </View>
        </View>
    );
}

export default Diary;

const styles = StyleSheet.create({
    add:{
        borderWidth: 2,
        borderColor: '#A7CBD9',
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    }
})