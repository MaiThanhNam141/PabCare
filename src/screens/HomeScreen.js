import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, ImageBackground } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RenderSliderImage from "../component/OtherScreen/RenderSliderImage";
import { getDocumentRef, getUserInfo } from "../feature/firebase/handleFirestore";
import { AIImage, logo, imageBG } from "../data/Link";
import LinearGradient from "react-native-linear-gradient";

const HomeScreen = ({ navigation }) => {
    const [displayName, setDisplayName] = useState('');
    const [coin, setCoin] = useState(0)
    const [type, setType] = useState("???")
    const [bmi, setBMI] = useState("???")
    const [eq, setEQ] = useState("???")
    const [modalVisible, setModalVisible] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);

    useEffect(() => {
        const fetchDataAndSetLoading = async () => {
            try {
                const [userData, snapshot] = await Promise.all([
                    getUserInfo(),
                    getDocumentRef('SliderImages')
                  ]);
                if (userData) {
                    setCoin(userData.coin)
                    setDisplayName(userData.displayName);
                    setType(userData.userType[userData.userType.length -1] || '???')
                    setBMI(userData.bmi || '???')
                    setEQ(userData.eq || '???')
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
        <ImageBackground source={imageBG} style={{flex:1, resizeMode:'contain'}}>
            <LinearGradient colors={['#FCFCFC', '#3A915E']} style={styles.container}>
                <TouchableOpacity
                style={styles.chatbotContainer}
                onPress={() => goChatAI()}>
                    <Text style={styles.chatbotText}>Hôm nay tôi có thể giúp gì cho bạn nè</Text>
                    <Image style={styles.chatbotLogo} source={AIImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationsButton}>
                        <MaterialIcons name="notifications" size={30} color="#000" />
                    </TouchableOpacity>
                <View style={styles.header}>
                    <Image style={styles.logo} source={logo} />
                    <Text style={styles.userNameText}>{displayName}</Text>
                </View>
                <View style={styles.divider}/>
                <View style={styles.mood}>
                    <Text style={styles.moodText}>Tâm trạng của bạn hôm nay thế nào ?</Text>
                    <View style={styles.coinContainer}>
                        <Text style={styles.cointext}>{coin}</Text>
                    </View>
                </View>
                <View style={styles.renderImage}>
                    <RenderSliderImage images={sliderImages} />
                </View>
                <View style={styles.quickstartMenu}>
                    <View style={styles.menuItem}>
                        <Image source={logo} style={styles.menuItemImage} />
                        <Text style={styles.menuItemText}>Thẻ thành viên</Text>
                    </View>
                    <View style={styles.menuItem}>
                        <Image source={logo} style={styles.menuItemImage} />
                        <Text style={styles.menuItemText}>Tư vấn</Text>
                    </View>
                    <View style={styles.menuItem}>
                        <Image source={logo} style={styles.menuItemImage} />
                        <Text style={styles.menuItemText}>Các chuyên gia</Text>
                    </View>
                    <View style={styles.menuItem}>
                        <Image source={logo} style={styles.menuItemImage} />
                        <Text style={styles.menuItemText}>Sách</Text>
                    </View>
                    <View style={styles.menuItem}>
                        <Image source={logo} style={styles.menuItemImage} />
                        <Text style={styles.menuItemText}>Từ thiện</Text>
                    </View>
                </View>
                <View style={styles.status}>
                    <Text style={styles.statusItem}>Nhóm: {type}</Text>
                    <Text style={styles.statusItem}>BMI: {bmi}</Text>
                    <Text style={styles.statusItem}>EQ: {eq}</Text>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Thông báo</Text>
                            <View style={styles.dividerModal} />
                            <View style={styles.notificationContainer}>
                                <Text style={styles.notificationText}>Bạn chưa có thông báo nào</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons name="close" size={25} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        borderRadius: 25,
        width: '100%',
        height: '88%',
        alignSelf: 'flex-end',
        marginTop:'21%',
    },
    header: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 0,
    },

    chatbotContainer: {
        backgroundColor: 'transparent',
        width: 200,
        height: 60,
        position: 'absolute',
        right:30,
        bottom:90,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
        zIndex:1
    },
    chatbotLogo:{
        width: 40,
        height: 40,
    },
    chatbotText:{
        backgroundColor:'rgba(248, 242, 242, 0.6)',
        width: 170,
        paddingLeft:15,
        paddingVertical:5,
        paddingRight:10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 100,
        borderTopRightRadius:100
    },
    notificationsButton: {
        position: 'absolute',
        padding: 10,
        right: 0,
        top: 0
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        alignSelf:'center',
        borderRadius:100
    },
    userNameText:{
        color:'#87bc9d',
        fontWeight:'700',
        marginLeft:5
    },
    divider:{
        backgroundColor:'#ffffff',
        width:'90%',
        height:5,
        marginBottom:30,
        alignSelf:'center'
    },
    mood:{
        backgroundColor:'#87bc9d',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginHorizontal:15,
        borderRadius:100,
        height:60
    },
    moodText:{
        color:'#153d2e',
        fontSize:11,
        fontWeight:'500'
    },
    coinContainer:{
        backgroundColor:'#3a915e',
        paddingVertical:10,
        paddingRight:20,
        paddingLeft:45,
        borderRadius:50,
    },
    cointext:{
        color:'#ffffff',
        fontWeight:'800',
        fontSize:12
    },
    quickstartMenu:{
        width:400,
        marginVertical:10,
        marginHorizontal:15,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    menuItem:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginLeft:10,
        width:'21%',
        marginTop:5
    },
    menuItemImage:{
        borderRadius:10,
        width: 60,
        height:60,
        resizeMode:'center',
        borderWidth:1,
        borderColor:'#000000'
    },
    menuItemText:{
        fontWeight:'500',
        textAlign:'center'
    },
    status:{
        backgroundColor:'#87bc9d',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginHorizontal:15,
        marginBottom:15,
        marginTop:10,
        borderRadius:30,
        height:50,
    },
    statusItem:{
        backgroundColor:'#3a915e',
        borderRadius:60,
        paddingRight:20,
        paddingLeft:20,
        paddingVertical:10,
        color:'#fff',
        fontWeight:'500',
        fontSize:14
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '85%',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color:'#202020'
    },
    dividerModal: {
        backgroundColor: '#333',
        height: 1,
        marginBottom: 10,
    },
    notificationContainer: {
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    renderImage:{
        marginVertical:20,
        alignSelf:'flex-start',
        marginLeft:15,
    },
    
})
export default HomeScreen;
