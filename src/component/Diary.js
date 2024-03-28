import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const Todo = () => {
    const [userTodolist, setUserTodolist] = useState([]);
    const [items, setItems] = useState({});

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
            
            userTodolist.forEach(todoItem => {
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

    useEffect(() => {
        const fetchUserTodolist = async () => {
            try {
                const currentUser = auth().currentUser;
                if (currentUser) {
                    const userSnapshot = await firestore()
                        .collection('users')
                        .doc(currentUser.uid)
                        .get();
                    if (userSnapshot.exists) {
                        const userData = userSnapshot.data();
                        setUserTodolist(userData.todolist || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching user todolist: ', error);
            }
        };

        fetchUserTodolist();
    }, []);

    useEffect(() => {
        const today = new Date();
        loadItems({ timestamp: today.getTime() });
    }, []);

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
                items={userTodolist.length > 0 ? items : { "Rảnh rỗi": [] }}
                loadItemsForMonth={loadItems}
                selected={timeToString(new Date())}
                renderItem={renderItem}
            />
            
        </View>
    );
}

export default Todo;
