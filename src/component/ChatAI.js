import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Image, KeyboardAvoidingView} from "react-native"
import React, { useState, useEffect } from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleGenerativeAI  } from "@google/generative-ai"
import {API_KEY} from '@env'
import useAuthCheck from "../feature/firebase/useAuthCheck";

const ChatAI = ({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('')
    const defaultAvatar = 'https://pabcare.com/wp-content/uploads/2023/11/1698813888606-2.jpg'

    const [loadingResponse, setLoadingResponse] = useState(false);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const AIImage = 'https://play-lh.googleusercontent.com/DDIUuR0XwdSLnuuyOTn3STuoemW_M1qCSLHs8HE6DJq0NrwUNxYafZ2qG-78Uxj76Q=w240-h480-rw'
    
    useEffect(() => {
      const { onAuthStateChanged } = useAuthCheck();
      const unsubscribe = onAuthStateChanged(setDisplayName, setAvatar);
      return () => unsubscribe();
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
            setMessages("Lỗi: Có vẻ tin nhắn của bạn đã vi phạm chính sách an toàn của PABCARE. Vui lòng thử lại với nội dung khác.");
          } else {
            setMessages(e.message || e.toString());
            console.error(e.message);
          }
        }
        finally{
          setLoadingResponse(false);
        }
    }
    
  
    const sendMessage = async () => {
      try {
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
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    };
    
  
    const isCurrentUser = (sender) => sender === displayName;
    return(
      <KeyboardAvoidingView style={styles.container}>
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
          {/* <Button style={styles.btnSend} title="Send" onPress={sendMessage} /> */}
          <TouchableOpacity style={styles.btnSend} onPress={sendMessage}>
              <MaterialIcons name="send" color="#1341e8" size={30}/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
}
export default ChatAI

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth:150
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
    justifyContent: 'center',
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
    minWidth:300,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  btnSend:{
    borderRadius: 45,
  }
});