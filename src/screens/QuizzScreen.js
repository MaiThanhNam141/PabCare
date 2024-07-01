import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid, FlatList, ImageBackground, Alert, ScrollView, Image } from 'react-native';
import { updateUserInfo, getUserInfo } from '../feature/firebase/handleFirestore';
import { imageBG, QuizzScreenIcon } from '../data/Link';

const QuizzScreen = ({ navigation }) => {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [userGender, setUserGender] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserInfo();
        setUserGender(user.gender || '');
        setUserInfo(user || '')
      } catch (error) {
        ToastAndroid.show("Hãy thử đăng nhập lại!", ToastAndroid.SHORT)
      }
    };
    fetchData();
  }, []);

  const goToScreen = (selectedQuiz) => {
    navigation.navigate(selectedQuiz)
  }

  const renderData = [
    { id: 1, title: 'MBTI Test', questions: 52, link:QuizzScreenIcon.mbti},
    { id: 2, title: 'EQ Test', questions: 40, link:QuizzScreenIcon.eq},
    { id: 3, title: 'BDI Test', questions: 21, link:QuizzScreenIcon.bdi},
    { id: 4, title: 'DISC', questions: '???', link:QuizzScreenIcon.disc},
  ];

  const renderTest = ({ item }) => {
    const alignmentStyle = item.id % 2 === 0 ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
    return (
      <TouchableOpacity
        style={styles.quizItem}
        onPress={() => handleQuizSelection(item)}
      > 
        <>
          <Image source={item.link} style={styles.quizImage}></Image>
          <View style={styles.quizImageOverlay} />
        </>
        <Text style={[alignmentStyle ,styles.quizTitle]}>{item.title}</Text>
        <View style={[alignmentStyle, {backgroundColor:'#fff', borderRadius:5, marginHorizontal:15}]}>
          <Text style={styles.quizNumber}>{item.questions}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleQuizSelection = (selectedQuiz) => {
    switch (selectedQuiz.id) {
      case 1:
        handleSubmitMBTI()
        break;
      case 2:
        goToScreen('eq')
        break;
      case 3:
        goToScreen('bdi')
        break;
      case 4:
        Alert.alert('Lỗi',"Tính năng đang phát triển")
        break;
      default:
        goToScreen(selectedQuiz.title)
        break;
    }
  };

  const handleSubmitMBTI = () => {
    setShowGenderModal(true);
    if (userGender === '') {
      ToastAndroid.show('Vui lòng chọn giới tính', ToastAndroid.SHORT);
    } else {
      updateUserInfo({ gender: userGender })
        .then(() => {
          navigation.navigate('quiz');
        })
        .catch((error) => {
          console.log('Cập nhật dữ liệu thất bại:', error);
        });
    }
  };

  const renderUserType = () => {
    return userInfo?.userType?.map((type, index) => (
      <Text key={index} style={styles.userTypeText}>
        <Text style={{fontWeight:'300'}}>Kiểu:</Text> {type}{' '}
        <Text style={{fontWeight:'300'}}>ở lần thử:</Text> {index + 1}
      </Text>
    ));
};

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBG} style={styles.imageBackground}>
        <View style={styles.mainContainer}>
          <View style={styles.title}>
            <Text style={styles.titleText}>ALL TEST</Text>
          </View>
          {/* <TouchableOpacity style={styles.totalResult} onPress={()=>setShowUserInfoModal(true)}>
            <Text style={styles.totalResultText}>Tổng hợp các kết quả</Text>
          </TouchableOpacity> */}
          <FlatList
            data={renderData}
            renderItem={renderTest}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContainer}
            numColumns={1}
          />

          {userGender === '' && (
            <Modal
              visible={showGenderModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowGenderModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Chọn giới tính của bạn</Text>
                  <View style={styles.genderButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.genderButton, userGender === 'male' && styles.selectedGender]}
                      onPress={() => setUserGender('male')}
                    >
                      <Text style={[styles.genderText, userGender === 'male' && styles.selectedText]}>Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, userGender === 'female' && styles.selectedGender]}
                      onPress={() => setUserGender('female')}
                    >
                      <Text style={[styles.genderText, userGender === 'female' && styles.selectedText]}>Nữ</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitMBTI}>
                      <Text style={styles.submitText}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.submitButton, { backgroundColor: '#f20f2d' }]}
                      onPress={() => setShowGenderModal(false)}
                    >
                      <Text style={styles.submitText}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
           <Modal
            visible={showUserInfoModal} 
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowUserInfoModal(false)}
          >
            <View style={styles.userInfoModalContainer}>
              <View style={styles.userInfoModalContent}>
                <Text style={styles.userInfoModalTitle}>Thông tin người dùng</Text>
                <View style={styles.userTypeContainer}>
                  {renderUserType()}
                </View>
                <Text>{userInfo.BDIRateID}</Text>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: '#f20f2d' }]}
                  onPress={() => setShowUserInfoModal(false)}
                >
                  <Text style={styles.submitText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fafaf7',
    borderRadius: 25,
    width: '100%',
    height: '85%',
    alignSelf: 'flex-end',
    marginTop: '20%'
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  quizItem: {
    width: 333, 
    height: 113, 
    marginHorizontal: 10, 
    marginVertical:5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'#87bc9d'
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal:15
  },
  quizNumber:{
    fontWeight:'700',
    fontSize:15,
    paddingVertical:3,
    paddingHorizontal:35,
    color:'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 330,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
  },
  genderText: {
    fontSize: 16,
  },
  selectedGender: {
    backgroundColor: '#16afc7',
    borderColor: '#16afc7',
  },
  selectedText: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#16afc7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title:{
    padding:5,
    margin:10,
    // marginBottom:10,
    alignItems:'center',
    marginTop:30
  },
  titleText:{
    fontWeight:'900',
    fontSize:23,
    color:'#87bc9d'
  },
  totalResult:{
    borderColor:'green',
    borderWidth:1,
    width:340,
    height:80,
    alignItems:'center',
    justifyContent:'center'
  },
  totalResultText:{
    fontSize:25,
    textAlign:'center',
    fontWeight:'600'
  },
  userInfoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userInfoModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  userInfoModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userTypeContainer: {
    marginVertical: 10,
  },
  userTypeText:{
    fontWeight:'bold',
    textAlign:'center',
  },
  quizImage:{
    width:330,
    height:110,
    borderRadius:15,
    resizeMode:'cover',
    overflow:'hidden',
    position:'absolute',
    top: 0,
    left: 0,
  },
  quizImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius:15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
});

export default QuizzScreen;