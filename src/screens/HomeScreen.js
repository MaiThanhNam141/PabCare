import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, FlatList, ScrollView, Dimensions } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderSliderImage from "../component/OtherScreen/RenderSliderImage";
import { getDocumentRef } from "../feature/firebase/handleFirestore";
import { AIImage, logo } from "../data/Link";

const HomeScreen = ({ navigation }) => {
    const [displayName, setDisplayName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);

    const [chatAIBottom, setChatAIBottom] = useState(40);
    const scrollViewRef = useRef(null);

    const [data, setData] = useState([
        { id: 1, title: "Phổ biến", offer:'Ưu đãi đặc biệt', price:'99.000/giờ' },
        { id: 2, title: "Vip", offer:'Giá tốt nhất', price:'499.000/tuần', vip1:'Có thể hẹn và gặp chuyên viên tâm lý của bản thân bất kỳ ngày nào trong tuần với giới hạn 1 giờ/ngày', vip2: 'Gói sẽ kích hoạt khi khách hàng sử dụng giờ đầu tiên' },
        { id: 3, title: "Prenium", offer:'Cao cấp nhất', price:'1.399.000/tháng', prenium1:'Có thể hẹn và gặp chuyên viên tâm lý của bản thân bất kỳ ngày nào trong tuần với giới hạn 1 giờ/ngày trong suốt 1 tháng với hạn mức 29 giờ', prenium2: 'Được tặng kèm thẻ Silver Plus (199k) của PABCARE', prenium3: 'Hỗ trợ đánh giá tổng hợp, hoàn cảnh trong các cuộc họp mặt, gặp gỡ và kí kết' },
    ]);

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

    const renderItem = ({item}) => {
        return (
            <View style={styles.membershipCard}>
                <View style={{justifyContent:'flex-start'}}>
                    <View style={styles.offerContainer}>
                        <Text style={styles.offerText}>{item.offer}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>{item.title} </Text>
                        <Text style={styles.priceValue}> {item.price}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Tham vấn tâm lý tổng hợp</Text>
                        <Text style={styles.infoText}>Giải đáp thắc mắc, câu hỏi</Text>
                        <Text style={styles.infoText}>Thiết kế lộ trình, lời khuyến hữu ích</Text>
                        <Text style={styles.infoText}>Tư vấn lắng nghe cảm xúc, tâm trí, stress, lo âu, áp lực</Text>
                        <Text style={styles.infoText}>Hỗ trợ 4 phương tiện cá nhân, gia đình, tình yêu, công việc</Text>
                        <Text style={styles.infoText}>Hỗ trợ đa địa điểm văn phòng, nơi làm việc, nhà riêng, ngoài trời</Text>
                        <Text style={styles.infoText}>{item.id === 2 ? item.vip1 : item.id === 3 ? item.prenium1 : ''}</Text>
                        <Text style={styles.infoText}>{item.id === 2 ? item.vip2 : item.id === 3 ? item.prenium2 : ''}</Text>
                        <Text style={styles.infoText}>{item.id === 3 ? item.prenium3 : ''}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>ĐĂNG KÝ NGAY</Text>
                </TouchableOpacity>
            </View>
        );
    };
    useEffect(() => {
        const handleMeasure = () => {
          scrollViewRef.current.measure((x, y, width, height, pageX, pageY) => {
            console.log("ScrollView position:", { x, y, width, height, pageX, pageY });
          });
        };
    
        handleMeasure();
    }, [scrollViewRef.current]);

    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        const { height: screenHeight } = Dimensions.get('window');
        const chatAIBottom = Math.ceil(screenHeight - y - 320);
        setChatAIBottom(chatAIBottom > 40 ? chatAIBottom : 40);
    };
    
    return (
        <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={0}>
        <View style={styles.container}>
            <TouchableOpacity
            style={[styles.chatbotContainer, {bottom: chatAIBottom}]}
            onPress={() => goChatAI()}>
                <Text style={styles.chatbotText}>Xin chào! {displayName?displayName:''}</Text>
                <Image style={styles.chatbotLogo} source={AIImage} />
            </TouchableOpacity>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationsButton}>
                    <MaterialIcons name="notifications" size={30} color="#000" />
                </TouchableOpacity>
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.title}>Dịch vụ tư vấn tâm lý</Text>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
            />
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thông báo</Text>
                        <View style={styles.divider} />
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
        </View>
    </ScrollView>
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
    chatbotContainer: {
        backgroundColor: 'transparent',
        width: 200,
        height: 60,
        position: 'absolute',
        right:30,
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
    divider: {
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
        borderWidth: 0,
        marginRight:50,
    },
    mainContainer:{
        alignItems:'center',
        margin: 5,
        marginBottom:30
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    membershipCard:{
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        width:300,
        elevation:5,
        padding:20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 15,
        justifyContent:'space-between'
    },
    offerContainer: {
        marginBottom: 10,
        backgroundColor: '#F34621',
        marginRight: 110
    },
    offerText: {
        color: '#F3F3F3',
        fontWeight: 'bold', 
        padding: 3,
        paddingRight: 20,
        borderRadius: 2,
        fontSize:15
    },
    priceContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical:10,
        justifyContent:'space-between',
        alignItems:'center'
    },
    priceLabel: {
        fontWeight: '600',
        fontSize:16,
        color:'#000000'
    },
    priceValue: {
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize:20,
        color:'#000000'
    },
    infoContainer: {
        marginBottom: 10,
    },
    infoText: {
        marginBottom: 5,
        color: '#7C7C7C',
        fontSize: 12,
        fontStyle:'italic',
        textAlign:'justify'
    },
    submitButton:{
        padding: 10,
        borderRadius: 15,
        backgroundColor:'#13C73B',
        marginTop: 10,
    },
    submitButtonText:{
        color: '#F3F3F3',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize:18,
        paddingVertical:5
    }
    
})
export default HomeScreen;
