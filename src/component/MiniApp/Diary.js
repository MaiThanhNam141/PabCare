import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';


const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const Diary = () => {

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