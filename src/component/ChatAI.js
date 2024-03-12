import { Text, View, TextInput, Button, ToastAndroid, ActivityIndicator, StyleSheet, FlatList, Image} from "react-native"
import React, { useState, useEffect } from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleGenerativeAI  } from "@google/generative-ai"
import auth from '@react-native-firebase/auth';
import {API_KEY} from '@env'

import firestore from '@react-native-firebase/firestore';


const ChatAI = () => {
    const [text, setText] = useState('')

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('')

    const [loadingResponse, setLoadingResponse] = useState(false);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const AIImage = 'https://play-lh.googleusercontent.com/DDIUuR0XwdSLnuuyOTn3STuoemW_M1qCSLHs8HE6DJq0NrwUNxYafZ2qG-78Uxj76Q=w240-h480-rw'
    useEffect(() => {
      const fetchData = async () => {
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setDisplayName(userDoc.data().displayName);
            setAvatar(userDoc.data().photoURL)
          }
        }
        else{
          navigation.navigate('loginscreen');
        }
      };
  
      fetchData();
    }, []);

    const handleGenerateContent = async () => { 
        try {       
          setLoadingResponse(true);
          const model = genAI.getGenerativeModel({ model: "gemini-pro"});
          const result = await model.generateContent("You're a Mental Health Counselor at Pabcare Counseling Center " 
                                                        +"(Trung tâm hỗ trợ Pabcare) in Vietnamese."
                                                        +" Use friendly, funny and simple Vietnamese language to respond." 
                                                        +" Using 'tớ' to refer yourself and 'cậu' to refer me "
                                                        +" This is a promt: " + messages);
          return result.response.text();
        }
        catch (e){
          if (e.code === "SAFETY") {
            setText("Lỗi: Có vẻ tin nhắn của bạn đã vi phạm chính sách an toàn của PABCARE. Vui lòng thử lại với nội dung khác.");
          } else {
              setText(e.message || e.toString());
              console.error(e.message);
          }
        }
        finally{
          setLoadingResponse(false);
        }
    }
    
  
    const sendMessage = async () => {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Math.random().toString(), text: newMessage, sender: displayName, avatar: avatar } 
      ]);
      setNewMessage('');
      const aiResponse = await handleGenerateContent(newMessage);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Math.random().toString(), text: aiResponse, sender: 'Gemini', avatar: AIImage } 
      ]);
    };
  
    const isCurrentUser = (sender) => sender === displayName;
    return(
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, isCurrentUser(item.sender) && styles.currentUserMessage]}>
              {!isCurrentUser(item.sender) && (
                <View style={styles.senderInfo}>
                  <Image style={styles.avatar} source={{ uri: item.avatar }} />
                  <Text style={styles.senderName}>{item.sender}</Text>
                </View>
              )}
              <Text>{item.text}</Text>
            </View>
          )}
        />
        {loadingResponse && ( 
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message here"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    )
}
export default ChatAI

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    messageContainer: {
      padding: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      maxWidth: '80%',
    },
    currentUserMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#b3e5fc',
    },
    senderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 5,
    },
    senderName: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    input: {
      flex: 1,
      marginRight: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
    },
    loadingContainer: {
      alignItems: 'center',
  },
  });