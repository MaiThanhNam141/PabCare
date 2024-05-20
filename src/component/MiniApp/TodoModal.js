import React, { useState} from 'react';
import { 
    Text, 
    StyleSheet, 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    KeyboardAvoidingView, 
    TextInput, 
    Keyboard, 
    ToastAndroid,
    Alert, } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

let todoId = 0;

const TodoModal = (props) => {
    const [newTodo, setNewTodo] = useState("");

    const list = props.list;
    const taskCount = list.todos ? list.todos.length : 0;
    const completedCount = list.todos ? list.todos.filter(todo => todo.completed).length : 0;

    const toggleTodoCompleted = index => {
        list.todos[index].completed = !list.todos[index].completed;
        props.updateList(list);
    };

    const addTodo = () => {
        if (!newTodo.trim()) {
            Alert.alert("Vui lòng nhập tên công việc");
            return;
        }
        if (!list.todos.some(todo => todo.title === newTodo)) {
            try {
                const newID = todoId++
                list.todos.push({id: newID, title: newTodo, completed: false });
                setNewTodo("");
                Keyboard.dismiss();
                props.updateList(list);
            } catch (error) {
                Alert.alert("Đã có lỗi xảy ra");
                console.log("Todo Modal got errror:", error)
            }
        } else {
            Alert.alert("Công việc này đã tồn tại");
        }
    };

    
    const deleteTodo = index => {
        list.todos.splice(index, 1);
        props.updateList(list);
    };

    const renderTodo = ({item, index}) => {
        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
                    <MaterialIcons
                        name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color="#999"
                        style={{ width: 32 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleTodoCompleted(index)} style={{flex: 5}}>
                    <Text
                        style={[
                            styles.todo,
                            { color: item.completed ? "#999" : "#000", textDecorationLine: item.completed ? 'line-through' : 'none' }
                        ]}
                    >{item.title}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(index)} style={{width: 27,height: 27,}}>
                    <View style={styles.deleteButton}>
                        <MaterialIcons name='delete' size={18} color="#e6e6e6" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 20, right: 25, zIndex: 10 }}
                    onPress={props.closeModal}
                >
                    <MaterialIcons name='close' size={35} color="#000" />
                </TouchableOpacity>
                <View style={[styles.section, styles.header, { borderBottomColor: list.color }]} >
                    <View>
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.taskCount}>{completedCount} of {taskCount} tasks</Text>
                    </View>
                </View>
                <View style={[styles.section, { flex: 4, marginVertical: 10, marginRight:10 }]}>
                    <FlatList
                        data={list.todos}
                        renderItem={({ item, index }) => renderTodo({item, index})}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <View style={[styles.section, styles.footer]}>
                    <TextInput
                        style={[styles.input, { borderColor: list.color }]}
                        onChangeText={text => setNewTodo(text)}
                        value={newTodo}
                    />
                    <TouchableOpacity style={[styles.addTodo, { backgroundColor: list.color }]} onPress={addTodo}>
                        <MaterialIcons name='add' size={16}/>
                    </TouchableOpacity>
                </View>
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    section: {
        flex: 1,
        alignSelf: "stretch"
    },
    header: {
        justifyContent: "flex-end",
        marginHorizontal: 15,
        marginTop:70,
        borderBottomWidth: 3,
        paddingTop: 5
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#000"
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: "#999",
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: "center",
        // paddingVertical: 10
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32,
        flex: 1
    },
    todo: {
        color: "#000",
        fontWeight: "700",
        fontSize: 16,
        marginLeft:10
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#ad050e',
        justifyContent:'center',
        alignItems: 'center',
        width: 27,
        height: 27,
        borderRadius: 100
    },
});

export default TodoModal;
