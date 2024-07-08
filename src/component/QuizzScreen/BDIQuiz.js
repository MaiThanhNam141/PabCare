import React, {  useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, Modal, Alert, ScrollView, ActivityIndicator} from 'react-native';
import BDI from '../../data/BDI';
import BDI2 from '../../data/BDI2';
import { updateUserInfo } from '../../feature/firebase/handleFirestore';

const BDIQuiz = ({navigation}) => {
  const allQuestion = BDI;
  const answer = BDI2;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const saveResult = async(rate) => {
    try {
        setLoading(true);
        await updateUserInfo({BDIRateID: rate})
    } catch (error) {
        console.log(error)
        Alert.alert("Lỗi", "Hãy kiểm tra lại hệ thống mạng")
    }
    finally{
        setLoading(false);
        navigation.goBack()
    }
  }

  const restart = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
    setCurrentOptionSelected(null);
    setPoints(0);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false
    }).start();
  };

  const validateAnswer = (selectedOption) => {
    const currentQuestion = allQuestion[currentQuestionIndex];
    const correctOption = currentQuestion.options.find(option => option.text === selectedOption.text);
    setCurrentOptionSelected(selectedOption);
    if (correctOption) {
      const point  = correctOption.point;
      setPoints((prevPoint)=>prevPoint + point);
      setShowNextButton(true);
    } else {
      console.error('Không tìm thấy đáp án phù hợp.');
    }
  };
  

  const renderQuestion = () => {
    return (
      <View>
        <View style={styles.renderQuestion}>
          <Text style={[styles.text, { opacity: 0.6, marginRight: 2, color:'red', fontSize:20 }]}>{currentQuestionIndex + 1}</Text>
          <Text style={[styles.text, { fontSize: 12, opacity: 0.6 }]}>/ {allQuestion.length}</Text>
        </View>
        <Text style={[styles.text, styles.questionText]}>Bạn đang cảm thấy thế nào?</Text>
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
        <ScrollView contentContainerStyle={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
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
        <View style={{height:50}}></View>
        </ScrollView>
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
        <View style={styles.infoRow}>
          <Text style={styles.resultTextTitle}>Chẩn đoán sơ bộ: </Text>
          <Text style={styles.resultTextContent}>{personality.rate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.resultTextTitle}>Giải pháp: </Text>
          <Text style={styles.resultTextContent}>{personality.solution}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.resultTextTitle}>Lời khuyên: </Text>
          <Text style={styles.resultTextContent}>{personality.advice}</Text>
        </View>
      </View>
    );
  }

  const calculateResult = (points) => {
    const thresholds = [0, 9, 18, 29]; 
  
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (points > thresholds[i]) {
        return i;
      }
    }
  
    return 0; 
  };

  const userPersonality = () => {
    let totalPoint = calculateResult(points)
    let selectedPersonality = answer.find(index => index.id === totalPoint)
    if(!selectedPersonality){
      return 'Xảy ra lỗi'
    }
    return {
      id: selectedPersonality.id,
      rate: selectedPersonality.rate,
      solution: selectedPersonality.solution,
      advice: selectedPersonality.advice,
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
        <Modal animationType="slide" transparent={true} visible={showScoreModal} onRequestClose={()=>setShowScoreModal(false)}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Kết quả</Text>
                    <View style={styles.scoreContainer}>
                      {showScoreModal ? renderPersonalityInfo() : null}
                    </View>
                    <TouchableOpacity style={styles.retryButton} onPress={restart}>
                        <Text style={[styles.text, styles.retryButtonText]}>Làm lại</Text>
                    </TouchableOpacity>
                    { !loading ? 
                        <TouchableOpacity style={[styles.retryButton, {backgroundColor: '#F46A23'}]} onPress={()=>saveResult(userPersonality().rate)}>
                            <Text style={[styles.text, styles.retryButtonText, {color: 'white'}]}>Lưu</Text>
                        </TouchableOpacity>
                    :
                        <View>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    }
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
    width:340,
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
  resultTextTitle:{
    fontWeight:'bold',
    textAlign:'justify',
  },
  resultTextContent:{
    fontWeight:'400',
    textAlign:'justify',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default BDIQuiz;
