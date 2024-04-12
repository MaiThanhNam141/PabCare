import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, Modal } from 'react-native';
import data from '../data/QuizData';
import { getUserInfo } from '../feature/firebase/handleFirestore';

const Quizz = () => {
  const allQuestion = data;
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
    const gender = () => {
      const user = getUserInfo()
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
  const getMaxPoint = () => {
    let maxType = [];

    maxType.push(points.E <= points.I ? 'I' : 'E');
    maxType.push(points.S <= points.N ? 'N' : 'S');

    if (points.F === points.T) {
      
      maxType.push(userGender ? 'T' : 'F');
    } 

    maxType.push(points.J <= points.P ? 'P' : 'J');
    
    return { maxType };
  };

  const userPersonality = () => {
    let comment = []
    getMaxPoint().maxType.includes('E')?comment.push("Bạn là người loại E"):comment.push("Bạn là người loại I")
    getMaxPoint().maxType.includes('N')?comment.push("Bạn là người loại N"):comment.push("Bạn là người loại S")
    getMaxPoint().maxType.includes('T')?comment.push("Bạn là người loại T"):comment.push("Bạn là người loại F")
    getMaxPoint().maxType.includes('P')?comment.push("Bạn là người loại P"):comment.push("Bạn là người loại J")
    return comment.join("\n")
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
              <Text style={styles.modalTitle}>Congratulations</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.text}>Highest type: <Text style={{fontWeight:'bold'}}>{userPersonality()}</Text></Text>
              </View>
              <TouchableOpacity style={styles.retryButton} onPress={restart}>
                <Text style={[styles.text, styles.retryButtonText]}>Retry</Text>
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
    backgroundColor: '#defae3'
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
    // marginTop: 30,
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
    backgroundColor: '#1b7557',
    padding: 20,
    width: '100%',
    borderRadius: 20
  },
  retryButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20
  }
});

export default Quizz;
