import React, { useState } from 'react';
import { Text, StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import TodoModal from './TodoModal';

const TodoList = (props) => {
    const [showListVisible, setShowListVisible] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const list = props.list;
    const todos = list.todos || [];
    const completedCount = todos.filter(todo => todo.completed).length;
    const percentCount = (todos.length === 0 ? 0 : (completedCount*100)/todos.length).toFixed(0);
    const taskCount = list.todos ? list.todos.length : 0;

    const toggleListVisible = () => {
        setShowListVisible(!showListVisible);
    };

    const toggleDeleteAlert = () => {
        setShowDeleteAlert(!showDeleteAlert);
    };

    const deleteList = () => {
        toggleDeleteAlert();
        props.deleteList(list.id); 
    }

    return (
        <View>
            <Modal animationType='slide' visible={showListVisible} onRequestClose={() => toggleListVisible()}>
                <TodoModal list={list} closeModal={() => toggleListVisible()} updateList={props.updateList}/>
            </Modal>
            <TouchableOpacity style={[styles.listContainer, { borderColor: list.color }]} 
              onPress={() => toggleListVisible()} onLongPress={() => toggleDeleteAlert()}>
                <Text style={styles.taskCount}>{taskCount}</Text>
                <Text style={styles.listTitle} numberOfLines={2}>{list.name}</Text>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.count}>{percentCount}%</Text>
                </View>
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={showDeleteAlert} onRequestClose={() => setShowDeleteAlert(false)}>
                <View style={styles.alertContainer}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>Xóa <Text style={{fontWeight:'bold'}}>{list.name}</Text> ?</Text>
                        <View style={styles.alertButtons}>
                            <TouchableOpacity onPress={() => toggleDeleteAlert()} style={[styles.buttonContainer, { backgroundColor: '#fff' }]}>
                                <Text style={[styles.confirmButtonText, { color: 'black' }]}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteList()} style={styles.buttonContainer}>
                                <Text style={styles.confirmButtonText}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 25,
        paddingHorizontal: 10,
        borderRadius: 16,
        margin: 10,
        alignItems: "center",
        width: 150,
        height: 120,
        borderWidth: 3,
        backgroundColor: '#fafaf7'
    },
    listTitle: {
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 5,
        color: "black",
        marginTop:5,
        letterSpacing:-0.3,
        textAlign:'center'
    },
    count: {
        fontSize: 12,
        fontWeight: "700",
        color: "black"
    },
    alertContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
        backgroundColor: 'white',
        padding: 15,
        paddingVertical: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    alertText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    alertButtons: {
        flexDirection: 'row',
    },
    confirmButtonText: {
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 20,
        fontWeight: '500'
    },
    buttonContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 15,
        marginHorizontal: 20,
        padding: 15,
        alignItems:'center',
        textAlign:'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    taskCount:{
        fontSize:10,
        color:'#2b7449',
        backgroundColor:'#d9d9d9',
        borderRadius:100,
        paddingVertical:3,
        paddingHorizontal:10,
        position:'absolute',
        top:5,
        right:5,
    }
});

export default TodoList;
