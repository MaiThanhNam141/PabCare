import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid, FlatList, ImageBackground, Alert } from 'react-native';
import { updateUserInfo, getUserInfo } from '../feature/firebase/handleFirestore';
import { imageBG } from '../data/Link';

const QuizzScreen = ({ navigation }) => {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [userGender, setUserGender] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserInfo();
        setUserGender(user.gender || '');
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
    { id: 1, title: 'MBTI Test', color: '#4287f5' },
    { id: 2, title: 'EQ Test', color: '#bcc219' },
    { id: 3, title: 'BDI Test', color: '#e06519' },
    { id: 4, title: 'DISC', color: '#000'},
  ];

  const renderTest = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.quizItem, { borderColor: item.color }]}
        onPress={() => handleQuizSelection(item)}
      >
        <Text style={[styles.quizTitle, {color:item.color}]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const handleQuizSelection = (selectedQuiz) => {
    console.log('Selected Quiz:', selectedQuiz);
    switch (selectedQuiz.id) {
      case 1:
        handleSubmitMBTI()
        break;
      case 2:
        Alert.alert("Tính năng đang phát triển")
        break;
      case 3:
        Alert.alert("Tính năng đang phát triển")
        break;
      case 4:
        Alert.alert("Tính năng đang phát triển")
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

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBG} style={styles.imageBackground}>
        <View style={styles.mainContainer}>
          <View style={styles.title}>
            <Text style={styles.titleText}>CÁC BÀI TEST</Text>
          </View>
          <FlatList
            data={renderData}
            renderItem={renderTest}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContainer}
            numColumns={2}
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
    alignItems: 'flex-start',
    width: '100%',
  },
  quizItem: {
    width: 160, 
    height: 160, 
    margin: 10, 
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
    borderWidth: 1
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    marginBottom:20,
    alignItems:'center',
    marginTop:30
  },
  titleText:{
    fontWeight:'900',
    fontSize:30,
    color:'black'
  }
});

export default QuizzScreen;