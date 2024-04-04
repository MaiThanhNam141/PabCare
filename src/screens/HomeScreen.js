import {View, StyleSheet, Image, Pressable, Text, ScrollView, ImageBackground, Modal } from "react-native"
import React, {useEffect, useState} from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatAI from "../component/ChatAI";
import NotificationsModal from "../component/NotificationModal";

const HomeScreen = ({navigation}) => {
    const imageLink = require('..//..//assets//Icons//Logo.png')
    const imageBackground = require('..//..//assets//bg-image.jpg')
    const AIImage = 'https://play-lh.googleusercontent.com/DDIUuR0XwdSLnuuyOTn3STuoemW_M1qCSLHs8HE6DJq0NrwUNxYafZ2qG-78Uxj76Q=w240-h480-rw'
    const [greetingHeight, setGreetingHeight] = useState(200);
    const [displayName, setDisplayName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const MAX_WIDTH = 250

    useEffect(() => {
        const fetchDataAndSetLoading = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData){
                  const user = JSON.parse(userData)
                  const width = user.displayName.length * 18;
                  if(width> MAX_WIDTH){
                    const height = Math.ceil(width / 2.2)
                    setGreetingHeight(height)
                  }
                  setDisplayName(user.displayName)
                  
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu và set loading:", error);
            }
        };
    
        fetchDataAndSetLoading();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchDataAndSetLoading();
          });
      
          return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView 
         style={styles.container} 
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator ={false}>
            <ImageBackground source={imageBackground} style={styles.imageBackground}/>
            <View style={styles.secondContainer}>
                <Pressable onPress={()=>setModalVisible(true)}>
                    <MaterialIcons name="notifications" size={30} style={styles.notifications}/>
                    {/* <Modal
                      animationType="slide"
                    //   transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setVisibleModal(false)}
                    >
                        <View style={styles.modalContainer}>
                        <NotificationsModal closeModal={() => setVisibleModal(false)} />
                        </View>
                    </Modal> */}
                </Pressable>
                <View style={styles.titleContainer}>
                    <Image style={styles.logo} source={imageLink}></Image>
                </View>
                <View style={styles.chatAIContainer}>
                    <Image style={styles.chatbotLogo} source={{uri:AIImage}} />
                    <Text style={styles.chatAIContentFirst}>Google AI <Text style={styles.chatAIContentSecond}>Gemini</Text></Text>
                    <View style={styles.chatContent}>
                        <Image style={styles.messageLogo} source={{uri:AIImage}} />
                        <View style={[styles.greeting, {maxHeight:greetingHeight}]}>
                            <Text 
                             style={styles.greetingText}>
                                Xin chào, {displayName ? displayName : "Guest"}
                            </Text>
                        </View>
                        <View style={[styles.greeting, {maxHeight: greetingHeight}]}>
                            <Text 
                             style={styles.greetingText}>
                                Nếu bạn cần giúp đỡ hãy liên hệ với tôi ngay nhé          
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    imageBackground:{
        flex:1,
        overflow:"hidden"
    },
    secondContainer:{
        flex:1,
        alignItems:"center",
        justifyContent: 'flex-start',
    },
    notifications:{
        alignSelf:"flex-end",
        margin:15
    },
    titleContainer:{
        marginBottom: 70,
        alignItems:"center",
        justifyContent: 'center',
    },

    logo:{
        width:200,
        height:200,
        resizeMode:"contain",
    },
    chatbotLogo:{
        width:40,
        height:40,
        borderRadius:100,
        marginTop:15
    },
    chatAIContainer:{
        width: 340,
        height: 650,
        backgroundColor:"#878784",
        alignItems:'center',
        borderRadius: 8
    },
    chatAIContentFirst:{
        fontSize: 23,
        fontWeight: '500',
        color:"#edd413"
    },
    chatAIContentSecond:{
        fontWeight:"bold",
        color:"#1be5f7",
    },
    chatContent:{
        backgroundColor:"#e8edea",
        flex:1,
        borderRadius:35,
        borderWidth:5,
        width:'80%',
        height:'80%',
        borderColor:"#e8edea",
        flexDirection:'column',
        flexWrap:'nowrap',
    },
    messageLogo:{
        width:20,
        height:20,
        borderRadius:100,
        marginVertical:15,
        marginLeft: 10
    },
    greeting:{
        alignItems:'flex-start',
        justifyContent:'flex-start',
        marginVertical: 15,
        marginRight: 15,
        marginLeft: 35,
        backgroundColor:'#b6bab8',
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
        flexDirection:'column',
        maxWidth: 240

    },
    greetingText:{
        fontWeight:'400',
        fontSize:14,
        marginHorizontal:4,
        maxWidth:'90%',
        maxHeight:'100%',
        padding: 8,
        paddingVertical: 5
    }
})