import React, { useState } from 'react';
import { Text, StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import TodoModal from './TodoModal';

const TodoList = (props) => {
    const [showListVisible, setShowListVisible] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const list = props.list;
    const todos = list.todos || [];
    const completedCount = todos.filter(todo => todo.completed).length;
    const remainingCount = todos.length - completedCount;

    const toggleListVisible = () => {
        setShowListVisible(!showListVisible);
    };

    const toggleDeleteAlert = () => {
        setShowDeleteAlert(!showDeleteAlert);
    };

    const deleteList = () => {
        toggleDeleteAlert()
        props.deleteList(list.id); 
    }
    return (
        <View>
            <Modal animationType='slide' visible={showListVisible} onRequestClose={() => toggleListVisible()}>
                <TodoModal list={list} closeModal={() => toggleListVisible()} updateList={props.updateList}/>
            </Modal>
            <TouchableOpacity style={[styles.listContainer, { backgroundColor: list.color }]} onPress={() => toggleListVisible()} onLongPress={()=>toggleDeleteAlert()}>
                <Text style={styles.listTitle} numberOfLines={1}>{list.name}</Text>
                <View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.count}>{remainingCount}</Text>
                        <Text style={styles.subTitle}>Remaining</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.count}>{completedCount}</Text>
                        <Text style={styles.subTitle}>Completed</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={showDeleteAlert} onRequestClose={()=>setShowDeleteAlert(false)}>
                <View style={styles.alertContainer}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>Are you sure you want to delete this list?</Text>
                        <View style={styles.alertButtons}>
                            <TouchableOpacity onPress={()=>toggleDeleteAlert()} style={[styles.buttonContainer, {backgroundColor:'#fff'}]}>
                                <Text style={[styles.confirmButtonText, {color:'black'}]}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>deleteList()} style={styles.buttonContainer}>
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
        paddingVertical: 30,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        alignItems: "center",
        width: 200,
    },
    listTitle: {
        fontWeight: "700",
        fontSize: 24,
        marginBottom: 15,
        color: "white"
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: "white"
    },
    subTitle: {
        fontWeight: "700",
        fontSize: 12,
        color: "white"
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
        paddingVertical:40,
        borderRadius: 30,
        alignItems: 'center',
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
        marginRight: 20,
        fontWeight:'500'
    },
    buttonContainer:{
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius:15,
        marginHorizontal: 20,
        alignSelf:'center',
        padding:15,
        paddingHorizontal:30,
        paddingLeft:45,
        justifyContent:'center',
        backgroundColor:'red'
    }
});

export default TodoList;
