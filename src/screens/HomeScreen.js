import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderSliderImage from "../component/RenderSliderImage";
import { getDocumentRef } from "../feature/firebase/handleFirestore";

const HomeScreen = ({ navigation }) => {
    const imageLink = require('..//..//assets//Icons//Logo.png');
    const AIImage = 'https://play-lh.googleusercontent.com/DDIUuR0XwdSLnuuyOTn3STuoemW_M1qCSLHs8HE6DJq0NrwUNxYafZ2qG-78Uxj76Q=w240-h480-rw';
    const [displayName, setDisplayName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);

    useEffect(() => {
        const fetchDataAndSetLoading = async () => {
            try {
                const [userData, snapshot] = await Promise.all([
                    AsyncStorage.getItem('user'),
                    getDocumentRef('SliderImages')
                  ]);
                if (userData) {
                    const user = JSON.parse(userData);
                    setDisplayName(user.displayName);
                }
                if(snapshot) {
                    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const imageUrls = images.map(image => image.link);


                    setSliderImages(imageUrls);
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu và set loading:", error);
            }
        };

        fetchDataAndSetLoading();
    }, [navigation]);

    const goChatAI = () => {
        navigation.navigate('chatai')
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.circle}
            onPress={() => goChatAI()}>
                <Text style={styles.chatbotText}>Xin chào, {displayName?displayName:'tài khoản khách'}</Text>
                <Image style={styles.chatbotLogo} source={{uri:AIImage}} />
            </TouchableOpacity>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationsButton}>
                    <MaterialIcons name="notifications" size={30} color="#000" />
                </TouchableOpacity>
                <Image style={styles.logo} source={imageLink} />
            </View>
            <View style={styles.mainContainer}>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
                <Text>Đây là dòng vô nghĩa</Text>
            </View>
            <View style={styles.renderImage}>
                <RenderSliderImage images={sliderImages} />
            </View>

            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.subModalContainer}>
                    <Text style={styles.subModalTitle}>Thông báo</Text>
                    <View style={styles.divider} />
                    <View style={styles.notifiContainer}>
                        <Text>Bạn chưa có thông báo nào</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <MaterialIcons name="close" size={25} color="black" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
    circle: {
        backgroundColor: '#fff',
        width: 200,
        height: 60,
        position: 'absolute',
        bottom: 40,
        right: 40,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row'
    },
    chatbotLogo:{
        width: 40,
        height: 40
    },
    notificationsButton: {
        position: 'absolute',
        padding: 10,
        right: 0,
        top: 0
    },
    logo: {
        marginTop: 15,
        width: 220,
        height: 220,
        resizeMode: "contain",
        alignSelf:'center'
    },
    chatbotText:{
        backgroundColor:'#dee0df',
        width: 160,
        paddingTop: 10,
        paddingLeft:20,
        paddingBottom:10,
        paddingRight:5,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 40,
        borderTopRightRadius:40
    },
    subModalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(230, 255, 255, 1)',
    },
    subModalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 60
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    divider: {
        backgroundColor: '#000000',
        height: 2,
        paddingHorizontal:500,
        marginTop:5,
        marginBottom:25,
        alignSelf: "center"
    },
    notifiContainer:{
        backgroundColor:"#FFFFFF",
        paddingHorizontal: 80,
        flex:1,
        borderRadius:30

    },
    renderImage:{
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 20
    },
    mainContainer:{
        alignItems:'center',
        margin: 15,
    }
})
export default HomeScreen;
