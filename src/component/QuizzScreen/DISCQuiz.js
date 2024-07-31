import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, Modal, Alert, ScrollView, ActivityIndicator } from 'react-native';
import DISCQ from '../../data/DISCQ';
import EQ2 from '../../data/EQ2';
import { updateUserInfo } from '../../feature/firebase/handleFirestore';

const DISCQuiz = ({ navigation }) => {
  const allQuestion = DISCQ;
  const answer = EQ2;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [points, setPoints] = useState({
    D: 0,
    I: 0,
    S: 0,
    C: 0,
  });
  const [tempPoint, setTempPoint] = useState(0);
  const [tempType, setTempType] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestion.length],
    outputRange: ['0%', '100%']
  });

  const handleNext = () => {
    setPoints(prevPoints => ({
      ...prevPoints,
      [tempType]: prevPoints[tempType] + tempPoint
    }));
    setTempPoint(0);
    setTempType('');

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

  const saveResult = (score) => {
    try {
      setLoading(true);
      updateUserInfo({ eq: score });
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Hãy kiểm tra lại hệ thống mạng");
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  }

  const restart = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
    setCurrentOptionSelected(null);
    setPoints({
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    });
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
      const { type, point } = correctOption;

      setTempPoint(point);
      setTempType(type);
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
          <Text style={[styles.text, { opacity: 0.6, marginRight: 2, color: 'red', fontSize: 20 }]}>{currentQuestionIndex + 1}</Text>
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
        {currentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => validateAnswer(option)}
            style={[
              styles.answerContainer,
              {
                borderColor: option === currentOptionSelected ? '#87bc9d' : '#e1e3e1',
                backgroundColor: option === currentOptionSelected ? '#87bc9d' : '#e1e3e1',
              }
            ]}
          >
            <Text style={styles.text}>{option.text}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 50 }}></View>
      </ScrollView>
    );
  };

  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={[styles.text, styles.nextButtonText]}>Tiếp</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderPersonalityInfo = () => {
    // const personality = userPersonality();
    return (
      <View style={styles.returnContainer}>
        {/* <View style={styles.eqContainer}>
          <Text style={styles.eqText}>EQ: {personality.EQ}</Text>
        </View>
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.resultTextContent}>{personality.EA.comment}</Text>
            <Text style={styles.resultTextContent}>{personality.EM.comment}</Text>
            <Text style={styles.resultTextContent}>{personality.SEA.comment}</Text>
            <Text style={styles.resultTextContent}>{personality.RM.comment}</Text>
          </View>
        </View> */}
        <Text>Chưa làm</Text>
        <View style={{marginTop:10}}>
          <TouchableOpacity style={styles.retryButton} onPress={restart}>
            <Text style={[styles.text, styles.retryButtonText]}>Làm lại</Text>
          </TouchableOpacity>
          {!loading ?
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: '#F46A23' }]} onPress={() => saveResult(userPersonality().EQ)}>
              <Text style={[styles.text, styles.retryButtonText, { color: 'white' }]}>Lưu</Text>
            </TouchableOpacity>
            :
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          }
        </View>
      </View>
    );
  };

  const calculateResult = (points) => {
    const thresholds = [0, 25, 35];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (points > thresholds[i]) {
        return i;
      }
    }
    return 0;
  };

  const userPersonality = () => {
    let indexEA = calculateResult(points.D);
    let indexEM = calculateResult(points.I);
    let indexSEA = calculateResult(points.S);
    let indexRM = calculateResult(points.C);

    const total = points.D + points.I + points.S + points.C;

    return {
      EA: answer.D[indexEA],
      EM: answer.I[indexEM],
      SEA: answer.S[indexSEA],
      RM: answer.C[indexRM],
      EQ: total,
    };
  };

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
    fontWeight: '400',
    textAlign:'justify'
  },
  questionText: {
    color: '#2b2b24',
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '100%',
    height: 15,
    borderRadius: 20,
    backgroundColor: '#98bc9d',
    marginBottom: 20,
  },
  progressBar: {
    height: 15,
    borderRadius: 20,
    backgroundColor: '#3a915e'
  },
  answerContainer: {
    width: 340,
    borderWidth: 3,
    borderColor: '#39453b',
    backgroundColor: '#0a97cf',
    minHeight: 85,
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
    alignSelf: 'center'
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    flexWrap: 'nowrap'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#62c87b'
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
    paddingVertical: 10,
    width: 300,
    borderRadius: 20,
    marginVertical: 5
  },
  retryButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20
  },
  returnContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:10,
    paddingVertical:10,
  },
  eqContainer: {
    marginBottom: 10,
  },
  eqText: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  resultTextTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultTextContent: {
    fontWeight: '400',
    fontSize: 14,
    textAlign:'justify',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DISCQuiz;
