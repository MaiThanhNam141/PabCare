import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, Modal, Alert, ScrollView, ActivityIndicator } from 'react-native';
import EQ from '../../data/EQ';
import EQ2 from '../../data/EQ2';
import { updateUserInfo } from '../../feature/firebase/handleFirestore';

const EQQuiz = ({ navigation }) => {
  const allQuestion = EQ;
  const answer = EQ2;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [points, setPoints] = useState({
    EmotionalAwareness: 0,
    EmotionalManagement: 0,
    SocialEmotionalAwareness: 0,
    RelationshipManagement: 0,
  });
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

  const saveResult = async (score) => {
    try {
      setLoading(true);
      await updateUserInfo({ EQ: score });
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
      EmotionalAwareness: 0,
      EmotionalManagement: 0,
      SocialEmotionalAwareness: 0,
      RelationshipManagement: 0,
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
                borderColor: option === currentOptionSelected ? '#0be32f' : '#e1e3e1',
                backgroundColor: option === currentOptionSelected ? '#0be32f' : '#e1e3e1',
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
          <Text style={[styles.text, styles.nextButtonText]}>Next</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderPersonalityInfo = () => {
    const personality = userPersonality();
    if (personality === 'Lỗi') {
      return <Text>{personality}</Text>;
    }
    return (
      <View style={styles.returnContainer}>
        <View style={styles.eqContainer}>
          <Text style={styles.eqText}>EQ: {personality.EQ}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.resultTextTitle}>Emotional Awareness:</Text>
            <Text style={styles.resultTextContent}>{personality.EA.comment}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.resultTextTitle}>Emotional Management:</Text>
            <Text style={styles.resultTextContent}>{personality.EM.comment}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.resultTextTitle}>Social Emotional Awareness:</Text>
            <Text style={styles.resultTextContent}>{personality.SEA.comment}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.resultTextTitle}>Relationship Management:</Text>
            <Text style={styles.resultTextContent}>{personality.RM.comment}</Text>
          </View>
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
    let indexEA = calculateResult(points.EmotionalAwareness);
    let indexEM = calculateResult(points.EmotionalManagement);
    let indexSEA = calculateResult(points.SocialEmotionalAwareness);
    let indexRM = calculateResult(points.RelationshipManagement);

    const total = points.EmotionalAwareness + points.EmotionalManagement + points.SocialEmotionalAwareness + points.RelationshipManagement;
    if (!total) {
      return 'Lỗi';
    }

    return {
      EA: answer.EmotionalAwareness[indexEA],
      EM: answer.EmotionalManagement[indexEM],
      SEA: answer.SocialEmotionalAwareness[indexSEA],
      RM: answer.RelationshipManagement[indexRM],
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
        <Modal animationType="slide" transparent={true} visible={showScoreModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Kết quả</Text>
              <View style={styles.scoreContainer}>
                {showScoreModal ? renderPersonalityInfo() : null}
              </View>
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
    fontWeight: '400'
  },
  questionText: {
    color: '#2b2b24',
    fontSize: 30,
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
    width: '100%',
    borderRadius: 20,
    marginVertical: 5
  },
  retryButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20
  },
  returnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  eqContainer: {
    marginBottom: 20,
  },
  eqText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  resultTextTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultTextContent: {
    fontWeight: '400',
    fontSize: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EQQuiz;
