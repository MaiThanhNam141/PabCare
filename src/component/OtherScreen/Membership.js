import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const Membership = () => {

    const [data, ] = useState([
        { id: 1, title: "Phổ biến", offer:'Ưu đãi đặc biệt', price:'99.000/giờ' },
        { id: 2, title: "Vip", offer:'Giá tốt nhất', price:'499.000/tuần', vip1:'Có thể hẹn và gặp chuyên viên tâm lý của bản thân bất kỳ ngày nào trong tuần với giới hạn 1 giờ/ngày', vip2: 'Gói sẽ kích hoạt khi khách hàng sử dụng giờ đầu tiên' },
        { id: 3, title: "Prenium", offer:'Cao cấp nhất', price:'1.399.000/tháng', prenium1:'Có thể hẹn và gặp chuyên viên tâm lý của bản thân bất kỳ ngày nào trong tuần với giới hạn 1 giờ/ngày trong suốt 1 tháng với hạn mức 29 giờ', prenium2: 'Được tặng kèm thẻ Silver Plus (199k) của PABCARE', prenium3: 'Hỗ trợ đánh giá tổng hợp, hoàn cảnh trong các cuộc họp mặt, gặp gỡ và kí kết' },
    ]);

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
    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default Membership;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
});