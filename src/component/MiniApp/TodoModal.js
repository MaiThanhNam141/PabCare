import React, { useState } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Alert, Image, } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AIImage } from '../../data/Link';

let todoId = 0;

const TodoModal = (props) => {
    const [newTodo, setNewTodo] = useState("");
    const { list, date, user } = props;
    const vietsubName = date === 'Tomorrow' ? 'Ngày mai' : 'Hôm nay';

    const toggleTodoCompleted = index => {
        const newTodos = [...list.todos];
        newTodos[index].completed = !newTodos[index].completed;
        const newList = { ...list, todos: newTodos };
        props.updateList(newList);
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
        const newTodos = [...list.todos]; 
        newTodos.splice(index, 1); 
        const newList = { ...list, todos: newTodos };
        props.updateList(newList); 
    };

    const renderTodo = ({item, index}) => {
        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
                    <MaterialIcons
                        name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                        size={28}
                        color={list.color ? list.color : '#87bc9d'}
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
                {item.completed?
                    (<TouchableOpacity onPress={() => deleteTodo(index)} style={{width: 27,height: 27,}}>
                        <View style={styles.deleteButton}>
                            <MaterialIcons name='delete' size={28} color={list.color ? list.color : '#87bc9d'} />
                        </View>
                    </TouchableOpacity>)
                    :(null)
                }
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTitle}>
                    <View style={[styles.divider, { backgroundColor: list.color}]} />
                    <Text style={[styles.title, { backgroundColor: list.color}]}>{date ? vietsubName : list.name}</Text>
                    <View style={[styles.divider, { backgroundColor: list.color}]} />
                </View>

                <View style={[styles.section, { flex: 4, marginVertical: 10, marginRight: 10 }]}>
                    {user ? (
                        date === 'Today' ? (
                            list.date === 'Today' ? (
                                !list.todos?.length ? (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.helloUser}>Xin chào, {user}</Text>
                                            <Image source={AIImage} style={{ width: 55, height: 55 }} />
                                        </View>
                                        <Text style={styles.reminder}>Bạn muốn khởi động bằng việc gì ngày hôm nay?</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={list.todos}
                                        renderItem={({ item, index }) => renderTodo({ item, index })}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                                        showsVerticalScrollIndicator={false}
                                    />
                                )
                            ) : (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.helloUser}>Xin chào, {user}</Text>
                                        <Image source={AIImage} style={{ width: 55, height: 55 }} />
                                    </View>
                                    <Text style={styles.reminder}>Bạn muốn khởi động bằng việc gì ngày hôm nay?</Text>
                                </View>
                            )
                        ) : date === 'Tomorrow' ? (
                            list.date === 'Tomorrow' ? (
                                !list.todos.length ? (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text styles={styles.helloUser}>Xin chào, {user}</Text>
                                            <Image source={AIImage} style={{ width: 55, height: 55 }} />
                                        </View>
                                        <Text style={styles.reminder}>Lên kế hoạch cho ngày mai vào hôm nay là một ý tưởng sáng suốt đó!</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={list.todos}
                                        renderItem={({ item, index }) => renderTodo({ item, index })}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                                        showsVerticalScrollIndicator={false}
                                    />
                                )
                            ) : (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text styles={styles.helloUser}>Xin chào, {user}</Text>
                                        <Image source={AIImage} style={{ width: 55, height: 55 }} />
                                    </View>
                                    <Text style={styles.reminder}>Lên kế hoạch cho ngày mai vào hôm nay là một ý tưởng sáng suốt đó!</Text>
                                </View>
                            )
                        ) : (
                            <FlatList
                                data={list.todos}
                                renderItem={({ item, index }) => renderTodo({ item, index })}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )
                    ) : (
                        <FlatList
                            data={list.todos}
                            renderItem={({ item, index }) => renderTodo({ item, index })}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>


                <View style={[styles.section, styles.footer]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: list.color}]}
                        onChangeText={text => setNewTodo(text)}
                        value={newTodo}
                        placeholder='Điều gì đó bạn muốn thực hiện...'
                        placeholderTextColor={'#ffffff'}
                    />
                    <TouchableOpacity style={styles.addTodo} onPress={addTodo}>
                        <MaterialIcons name='reply' size={35} color={list.color ? list.color : '#87bc9d'}/>
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
    },
    section: {
        flex: 1,
        alignSelf: "stretch",
    },
    header: {
        justifyContent: "flex-end",
        marginHorizontal: 15,
        borderBottomWidth: 3,
        paddingTop: 5
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
        justifyContent:'center'
    },
    input: {
        flex: 1,
        height: 48,
        borderRadius: 60,
        paddingHorizontal: 8,
        color:'white',
        paddingLeft:25,
        marginLeft:-10
    },

    addTodo: {
        borderRadius: 4,
        padding: 16,
        marginRight:-15
    },
    todoContainer: {
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    todo: {
        color: "#000",
        fontWeight: "700",
        fontSize: 18,
        marginLeft:10
    },
    deleteButton: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        width: 27,
        height: 27,
        borderRadius: 100
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
        marginTop:25
    },
    helloUser:{
        color:'#2b7449',
        fontSize:27,
        fontWeight:'bold',
        marginRight:5
    },
    reminder:{
        color:'#737373',
        fontSize:10,
        fontWeight:'400',
    }
});

export default TodoModal;
