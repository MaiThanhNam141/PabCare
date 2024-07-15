import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, ImageBackground, Alert } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RenderSliderImage from "../component/OtherScreen/RenderSliderImage";
import { getDocumentRef, getUserInfo } from "../feature/firebase/handleFirestore";
import { AIImage, imageBG, defaultAvatar, HomeScreenIcon } from "../data/Link";
import LinearGradient from "react-native-linear-gradient";
import { UserContext } from "../feature/context/UserContext";
import Mood from "../component/MiniApp/Mood";

const HomeScreen = ({ navigation }) => {
    const [moodModalVisible, setMoodModalVisible] = useState(false);
    const [logoUser, setLogoUser] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [coin, setCoin] = useState(0);
    const [type, setType] = useState("???");
    const [bmi, setBMI] = useState("???");
    const [eq, setEQ] = useState("???");
    const [modalVisible, setModalVisible] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const { userLoggedIn } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, snapshot] = await Promise.all([
                    getUserInfo(),
                    getDocumentRef('SliderImages')
                ]);
                if (userData) {
                    setCoin(userData?.coin || 0);
                    setDisplayName(userData.displayName || 'Pabcare user');
                    setBMI(userData?.bmi || '???');
                    setEQ(userData?.eq || '???');
                    setLogoUser(userData.photoURL || defaultAvatar);
                    const userType = userData?.userType;
                    setType(userType ? userType[userType.length - 1] : '???');
                }
                if (snapshot) {
                    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const imageUrls = images.map(image => image.link);
                    setSliderImages(imageUrls);
                }
            } catch (error) {
                console.error("HomeScreen: Lỗi khi fetch dữ liệu và set loading:", error);
            }
        };

        fetchData();
    }, [navigation, userLoggedIn]);

    const goToScreen = (route) => {
        route ? navigation.navigate(route) : onDevelopment() ;
    };

    const onDevelopment = () => {
        Alert.alert("Thông báo", "Coming soon");
    };

    const toggleMoodModalVisible = () => {
        setMoodModalVisible(!moodModalVisible);
    };

    return (
        <ImageBackground source={imageBG} style={styles.imageBackground}>
            <LinearGradient colors={['#FCFCFC', '#3A915E']} style={styles.container}>
            <Image source={HomeScreenIcon.welcome} style={styles.imageWelcome}/>
                <TouchableOpacity
                    style={styles.chatbotContainer}
                    onPress={() => goToScreen("chatai")}
                >
                    <Text style={styles.chatbotText}>Hôm nay tôi có thể giúp gì cho bạn nè</Text>
                    <Image style={styles.chatbotLogo} source={AIImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationsButton}>
                    <MaterialIcons name="notifications" size={30} color="#000" />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Image style={styles.logo} source={{ uri: logoUser || defaultAvatar }} />
                    <Text style={styles.userNameText}>{displayName}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.mood}>
                    <TouchableOpacity onPress={toggleMoodModalVisible}>
                        <Text style={styles.moodText}> 😊 Tâm trạng của bạn hôm nay thế nào?</Text>
                    </TouchableOpacity>
                    <Modal animationType='slide' visible={moodModalVisible} onRequestClose={toggleMoodModalVisible}>
                        <Mood />
                    </Modal>
                    <View style={styles.coinContainer}>
                        <Text style={styles.coinText}>{coin}</Text>
                        <Image source={HomeScreenIcon.coin} style={styles.coinImage} />
                    </View>
                </View>
                <View style={styles.renderImage}>
                    <RenderSliderImage images={sliderImages} />
                </View>
                <View style={styles.quickstartMenu}>
                    {quickstartItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => goToScreen(item.namespace)}>
                            <Image source={item.icon} style={styles.menuItemImage} />
                            <Text style={styles.menuItemText}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
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

const quickstartItems = [
    { text: 'Thẻ thành viên', icon: HomeScreenIcon.member, namespace:'member' },
    { text: 'Tư vấn', icon: HomeScreenIcon.advise, namespace:'' },
    { text: 'Các chuyên gia', icon: HomeScreenIcon.professors, namespace:'' },
    { text: 'Sách', icon: HomeScreenIcon.book, namespace:'' },
    { text: 'Từ thiện', icon: HomeScreenIcon.charity, namespace:'' }
];

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: 'contain',
    },
    imageWelcome: {
        resizeMode:'cover', 
        alignSelf:'center', 
        height:50, 
        overflow:'hidden', 
        top: -55, 
        position: "absolute",
    },
    container: {
        justifyContent: 'space-evenly',
        borderRadius: 25,
        width: '100%',
        height: '88%',
        alignSelf: 'flex-end',
        marginTop: '21%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 0,
    },
    chatbotContainer: {
        backgroundColor: 'transparent',
        width: 200,
        height: 60,
        position: 'absolute',
        right: 30,
        bottom: 90,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 1,
    },
    chatbotLogo: {
        width: 62,
        height: 62,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#87bc9d',
    },
    chatbotText: {
        backgroundColor: 'rgba(248, 242, 242, 0.6)',
        width: 170,
        paddingLeft: 15,
        paddingVertical: 5,
        paddingRight: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100,
    },
    notificationsButton: {
        position: 'absolute',
        padding: 10,
        right: 0,
        top: 0,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        alignSelf: 'center',
        borderRadius: 100,
        marginLeft: 15,
        marginVertical: 6,
    },
    userNameText: {
        color: '#87bc9d',
        fontWeight: '700',
        marginLeft: 5,
    },
    divider: {
        backgroundColor: '#ffffff',
        width: '92%',
        height: 5,
        marginBottom: 15,
        alignSelf: 'center',
        marginTop: 5,
    },
    mood: {
        backgroundColor: '#87bc9d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginHorizontal: 15,
        borderRadius: 100,
        height: 40,
    },
    moodText: {
        color: '#153d2e',
        fontSize: 11,
        fontWeight: '500',
        letterSpacing:-0.3
    },
    coinContainer: {
        backgroundColor: '#3a915e',
        paddingVertical: 5,
        paddingRight: 10,
        paddingLeft: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    coinText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 10,
    },
    quickstartMenu: {
        width: "100%",
        marginBottom: 10,
        marginHorizontal: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    menuItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        width: '19%',
        marginTop: 5,
        marginBottom: 15,
    },
    menuItemImage: {
        borderRadius: 10,
        width: 45,
        height: 45,
        resizeMode: 'center',
        borderWidth: 4,
        borderColor: '#153d2e',
    },
    menuItemText: {
        fontWeight: '500',
        textAlign: 'center',
        fontSize: 10,
    },
    status: {
        backgroundColor: '#87bc9d',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15,
        marginTop: 10,
        borderRadius: 30,
        height: 50,
    },
    statusItem: {
        backgroundColor: '#3a915e',
        borderRadius: 60,
        paddingRight: 10,
        paddingLeft: 10,
        paddingVertical: 10,
        color: '#fff',
        fontWeight: '500',
        fontSize: 12,
        width: 100,
        textAlign: 'center',
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
        color: '#202020',
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
    renderImage: {
        marginBottom: 26,
        marginTop: 13,
        alignSelf: 'center',
        width:300
    },
    coinImage: {
        resizeMode: 'center',
        borderRadius: 100,
        overflow: 'hidden',
        width: 20,
        height: 20,
        marginLeft: 3,
    },
    moodBubble: {
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomRightRadius: 100,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        position: 'absolute',
        top: -52,
        left: 8,
        backgroundColor: '#87bc9d',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
});

export default HomeScreen;
