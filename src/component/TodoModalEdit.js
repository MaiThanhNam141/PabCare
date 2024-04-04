import React, { useState } from 'react'
import { Text, View, Modal, StyleSheet, TextInput, Button } from 'react-native'

export default  TodoModalEdit = ({modalVisible, setModalVisible, onSubmitQuest}) => {

    const [editText, setEditText] = useState("")

    const submitEditText = () => {
        onSubmitQuest(editText)
        console.log("Succress")
        setEditText(null)
        setModalVisible(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
            onDismiss={() => {
                setModalVisible(false)
            }}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Sửa công việc</Text>
                    <TextInput 
                        style={styles.textInput}
                        placeholder='Tên công việc ...' 
                        placeholderTextColor={'#666666'}
                        onChangeText={(text)=>setEditText(text)}
                    ></TextInput>
                    <View style={styles.btnGroup}>
                        <Button 
                            style={styles.cancelButton} 
                            title='Hủy' 
                            onPress={()=>setModalVisible(false)}></Button>
                        <Button 
                            style={styles.submitButton} 
                            title='Xác nhận'
                            onPress={()=>submitEditText()}></Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView:{
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:"center",
        flexDirection:'column',
    },
    modalView:{
        width: 300,
        height: 300,
        borderWidth:5,
        borderRadius:45,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(15, 50, 10, 0.1)',
    },
    cancelButton:{
        borderWidth: 3,
        borderRadius:15,
        borderColor:"#f21335",
        backgroundColor:"#f21335",
        fontWeight:'600',
        color:'#f21335',
        marginHorizontal:15,
        marginVertical:5,
        margin: 100
    },
    submitButton:{
        borderWidth: 3,
        borderRadius:15,
        borderColor:"#1ced35",
        backgroundColor: "#1ced35",
        fontWeight:'800',
        color:'#1ced35',
        marginHorizontal:15,
        marginVertical:5
    },
    title:{
        fontWeight:'bold',
        color:'black',
        fontSize: 35,
        margin : 20
    },
    btnGroup:{
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"space-around"
    },
    textInput:{
        fontSize: 14,
        width: 250,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 15,
        backgroundColor: "white"
    },
})

