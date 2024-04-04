import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, View, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DiaryModal = (props) => {
    const backgroundColor = ["#5CD859", "#24A6D9", "#8022D9", "#D159D8", "#D85963", "#D88559"];
    const [name, setName] = useState("");
    const [color, setColor] = useState(backgroundColor[0]);

    const createTodo = () => {
        if (!name.trim()) {
            ToastAndroid.show('Vui lòng nhập tên danh sách!', ToastAndroid.SHORT);
            return;
        }
        const list = { name, color };
        setName("");
        props.addList(list);
        props.closeModal();
    };

    const renderColors = () => {
        return backgroundColor.map(color => {
            return (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorSelect, { backgroundColor: color }]}
                    onPress={() => setColor(color)}
                />
            );
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={props.closeModal}>
                <MaterialIcons name='close' size={34} color="black" />
            </TouchableOpacity>
            <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
                <Text style={styles.title}>Create Todo List</Text>
                <TextInput
                    style={styles.input}
                    placeholder='List Name?'
                    onChangeText={text => setName(text)}
                    value={name}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                    {renderColors()}
                </View>

                <TouchableOpacity
                    style={[styles.create, { backgroundColor: color }]}
                    onPress={createTodo}
                >
                    <Text style={{ color: "white", fontWeight: "600" }} >Create!</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default DiaryModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "black",
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#24A6D9",
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 100,

    }
});
