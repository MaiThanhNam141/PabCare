import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, Modal, Image, ActivityIndicator, Alert } from 'react-native';
import data from '../../data/QuizData';
import QuizData2 from '../../data/QuizData2';
import { getUserInfo, getUserDocumentRef } from '../../feature/firebase/handleFirestore';
import { firebase } from '@react-native-firebase/firestore';
const Quizz = ({navigation}) => {
  const allQuestion = data;
  const answer = QuizData2;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [userGender, setUserGender] = useState('')
  const [points, setPoints] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  });
  
  const [progress] = useState(new Animated.Value(0));

  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestion.length],
    outputRange: ['0%', '100%']
  });

  const handleNext = () => {
    if (currentQuestionIndex === allQuestion.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowNextButton(false);
      setCurrentOptionSelected(null);
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  };

  const saveResult = async(type) => {
    const userRef = getUserDocumentRef()
    const userDoc = await userRef.get()
    try {
      if (!userDoc.exists || !userDoc.data().userType) {
        await userRef.set({ userType: [type] }, { merge: true });
      } else {
        await userRef.update({
          userType: firebase.firestore.FieldValue.arrayUnion(type)
        });
      }
      navigation.goBack()
    } catch (error) {
      console.log(error)
      Alert.alert("Lỗi", "Hãy kiểm tra lại hệ thống mạng")
    }
  }

  const restart = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
    setCurrentOptionSelected(null);
    setPoints({
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0
    });
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false
    }).start();
  };

  useEffect(()=>{
    const gender = async() => {
      const user = await getUserInfo()
      setUserGender(user.gender)
    }
    gender()
  }, [])

  const validateAnswer = (selectedOption) => {
    const currentQuestion = allQuestion[currentQuestionIndex];
    const correctOption = currentQuestion.options.find(option => option.text === selectedOption.text);
    setCurrentOptionSelected(selectedOption);
    if (correctOption) {
      const { type, point } = correctOption;
      setPoints({
        ...points,
        [type]: points[type] + point
      });
      setShowNextButton(true);
    } else {
      console.error('Không tìm thấy đáp án phù hợp.');
    }
  };
  

  const renderQuestion = () => {
    const currentQuestion = allQuestion[currentQuestionIndex];
    return (
      <View>
        <View style={styles.renderQuestion}>
          <Text style={[styles.text, { opacity: 0.6, marginRight: 2, color:'red', fontSize:20 }]}>{currentQuestionIndex + 1}</Text>
          <Text style={[styles.text, { fontSize: 12, opacity: 0.6 }]}>/ {allQuestion.length}</Text>
        </View>
        <Text style={[styles.text, styles.questionText]}>{currentQuestion.question}</Text>
      </View>
    );
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim
            }
          ]}
        />
      </View>
    );
  };

  const renderOptions = () => {
    const currentOptions = allQuestion[currentQuestionIndex].options;
    return (
      <View>
        {currentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => validateAnswer(option)}
            style={[
              styles.answerContainer,
              {
                borderColor: option === currentOptionSelected ? '#0be32f' : '#e1e3e1',
                backgroundColor: option === currentOptionSelected ? '#0be32f' : '#e1e3e1',
              }
            ]}
          >
            <Text style={styles.text}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderNextButton = () => {
    if (showNextButton) {
        return (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={[styles.text, styles.nextButtonText]}>Next</Text>
        </TouchableOpacity>
        );
    }
    };
  
  const renderPersonalityInfo = () => {
    const personality = userPersonality();
    if (personality === 'Xảy ra lỗi') {
      return <Text>{personality}</Text>;
    }
    return (
      <View>
        <Text>
          <Text style={styles.resultTextTitle}>Bạn là: </Text>
          <Text style={styles.resultTextContent}>{personality.subName}</Text>
        </Text>
        <Text>
          <Text style={styles.resultTextTitle}>Tính cách: </Text>
          <Text style={styles.resultTextContent}>{personality.kind}</Text>
        </Text>
        <Text>
          <Text style={styles.resultTextTitle}>Điểm mạnh: </Text>
          <Text style={styles.resultTextContent}>{personality.positive}</Text>
        </Text>
        <Text>
          <Text style={styles.resultTextTitle}>Điểm yếu: </Text>
          <Text style={styles.resultTextContent}>{personality.negative}</Text>
        </Text>
        <Text>
          <Text style={styles.resultTextTitle}>Cách cải thiện: </Text>
          <Text style={styles.resultTextContent}>{personality.solution}</Text>
        </Text>
        <Text>
          <Text style={styles.resultTextTitle}>Công việc phù hợp: </Text>
          <Text style={styles.resultTextContent}>{personality.jobSuitable}</Text>
        </Text>
      </View>
    );
  }

  const getMaxPoint = () => {
    let maxType = [];
    maxType.push(points.E <= points.I ? 'I' : 'E');
    maxType.push(points.S <= points.N ? 'N' : 'S');
    if (points.F === points.T) {
      maxType.push(userGender ? 'T' : 'F');
    }
    else {
      maxType.push(points.F <= points.T ? 'F' : 'T');
    }

    maxType.push(points.J <= points.P ? 'P' : 'J');
    return { maxType };
  };

  const userPersonality = () => {
    let max = getMaxPoint().maxType.join("")
    let selectedPersonality = answer.find(index => index.type === max)
    if(!selectedPersonality){
      return 'Xảy ra lỗi'
    }
    return {
      type: selectedPersonality.type,
      subName: selectedPersonality.subName,
      kind: selectedPersonality.kind,
      positive: selectedPersonality.positive,
      negative: selectedPersonality.negative,
      solution: selectedPersonality.solution,
      jobSuitable: selectedPersonality.jobSuitable,
      bgImage: selectedPersonality.bgImage
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16afc7" />
      <View style={styles.innerContainer}>
        {renderProgressBar()}
        {renderQuestion()}
        {renderOptions()}
        {renderNextButton()}
        <Modal animationType="slide" transparent={true} visible={showScoreModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Kết quả</Text>
              <View style={styles.scoreContainer}>
              {showScoreModal ? renderPersonalityInfo() : null}
              {showScoreModal && userPersonality().bgImage ?  <Image source={userPersonality().bgImage} style={styles.resultImage}/> : null }
              </View>
              <TouchableOpacity style={styles.retryButton} onPress={restart}>
                <Text style={[styles.text, styles.retryButtonText]}>Làm lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.retryButton, {backgroundColor: '#F46A23'}]} onPress={()=>saveResult(userPersonality().type)}>
                <Text style={[styles.text, styles.retryButtonText, {color: 'white'}]}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf0ef'
  },
  innerContainer: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  renderQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight:'400'
  },
  questionText: {
    color: '#2b2b24',
    fontSize: 30,
    fontWeight:'bold',

  },
  progressBarContainer: {
    width: '100%',
    height: 15,
    borderRadius: 20,
    backgroundColor: '#3f403f',
    marginBottom: 20,
  },
  progressBar: {
    height: 15,
    borderRadius: 20,
    backgroundColor: '#f5f7f5'
  },
  answerContainer: {
    borderWidth: 3,
    borderColor: '#39453b',
    backgroundColor: '#0a97cf',
    height: 85,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10
  },
  answer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  correctAnswer: {
    backgroundColor: '#37de31'
  },
  incorrectAnswer: {
    backgroundColor: '#f0472e'
  },
  nextButton: {
    backgroundColor: '#07e3cd',
    padding: 15,
    width: 360,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    alignSelf:'center'
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 25,
    color:'white',
    flexWrap:'nowrap'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf0ef'
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#62c87b'
  },
  scoreContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  scoreText: {
    fontWeight: '200',
    color: 'black'
  },
  retryButton: {
    borderColor: '#1b7557',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical:10,
    width: '100%',
    borderRadius: 20,
    marginVertical:5
  },
  retryButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20
  },
  resultImage:{
    resizeMode:'contain',
    width:250,
    height:250,
    backgroundColor: 'black',
    marginTop:10,
    borderRadius: 10,
    marginVertical: 10
  },
  resultTextTitle:{
    fontWeight:'bold',
    textAlign:'justify',
  },
  resultTextContent:{
    fontWeight:'400',
    textAlign:'justify',
  }
});

export default Quizz;
