import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid } from 'react-native';
import { updateUserInfo, getUserInfo } from '../feature/firebase/handleFirestore';

const QuizzScreen = ({navigation}) => {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [userGender, setUserGender] = useState('');

  useEffect(()=>{
    const fetchData = async() => {
      const user = await getUserInfo()
      setUserGender(user.gender || '')
    }
    fetchData()
  },[])


  const handleSubmit = () => {
    setShowGenderModal(true)
    if (userGender === '') {
      ToastAndroid.show("Đã xảy ra lỗi", ToastAndroid.SHORT)
    } else {
      if (updateUserInfo({gender: userGender})) {
        navigation.navigate('quiz')
      }
      else{
        console.log("Cập nhật dữ liệu thất bại")
      }
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>Bạn có muốn phân tích tính cách bằng MBTI test?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.answerButton}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.answerText}>Có</Text>
        </TouchableOpacity>
      </View>
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
              <View style={{flexDirection:'row', marginBottom: 30}}>
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
                  <Text style={[styles.genderText, , userGender === 'female' && styles.selectedText]}>Nữ</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitButton, {backgroundColor:'#f20f2d'}]} onPress={()=>setShowGenderModal(false)}>
                  <Text style={styles.submitText}>Hủy</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  answerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    width: 200,
    alignItems:'center',
    backgroundColor:'#2fedd4'
  },
  answerText: {
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: '#16afc7',
    borderColor: '#16afc7',
  },
  submitButton: {
    backgroundColor: '#16afc7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    margin: 5
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    elevation: 0,
    width: 330,
    height: 250
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    minWidth: 100,
    minHeight: 20,
    alignItems:'center',
    margin : 15
  },
  genderText: {
    fontSize: 16,
  },
  selectedGender: {
    backgroundColor: '#16afc7',
    borderColor: '#16afc7',
  },
  selectedText:{
    color: 'white',
    fontWeight:500
  },
});

export default QuizzScreen;
