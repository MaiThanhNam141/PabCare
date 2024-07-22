import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Image, KeyboardAvoidingView, ToastAndroid, Keyboard} from "react-native";
import React, { useState, useRef, useMemo, useCallback } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '@env';
import { gemini, AIImage } from "../../data/Link";

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [loadingResponse, setLoadingResponse] = useState(false);
  const flatListRef = useRef(null);

  const genAI = useMemo(() => new GoogleGenerativeAI(API_KEY), []);

  const handleGenerateContent = async (message) => { 
    try {       
      setLoadingResponse(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`
        You are a Mental Health Counselor at Pabcare Counseling Center 
        (Trung tâm hỗ trợ Pabcare) in Vietnamese. 
        Use friendly, funny and simple Vietnamese language to respond. 
        Using "tớ" to refer yourself and "cậu" to refer me. 
        This is command from user: ${message}
      `);
      return result.response.text();
    } catch (e) {
      return "Lỗi: Có vẻ tin nhắn của bạn đã vi phạm chính sách an toàn của PABCARE. Vui lòng thử lại với nội dung khác.";
    } finally {
      setLoadingResponse(false);
    }
  };
  
  const sendMessage = async () => {
    Keyboard.dismiss();
    if( newMessage.trim().length < 5)
        return ToastAndroid.show("Tin nhắn quá ngắn!", ToastAndroid.SHORT);
    try {
      const userMessage = { id: Math.random().toString(), text: newMessage, sender: "You", avatar: null };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setNewMessage('');
      const aiResponse = await handleGenerateContent(newMessage);
      const aiMessage = { id: Math.random().toString(), text: aiResponse, sender: 'Pabmind', avatar: AIImage };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };
  
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const isCurrentUser = useCallback((sender) => sender === "You", []);

  return (
      <KeyboardAvoidingView style={styles.container}>
          <View style={styles.title}>
              <Image source={gemini} style={styles.titleAvatar}></Image>
          </View>
          <FlatList
              ref={flatListRef}
              data={messages}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={scrollToBottom}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                  return (
                      <View style={[styles.messageContainer, isCurrentUser(item.sender) && styles.currentUserMessage]}>
                          {!isCurrentUser(item.sender) && (
                              <View style={styles.senderInfo}>
                                  <Image style={styles.avatar} source={item?.avatar} />
                                  <Text style={styles.senderName}>{item?.sender}</Text>
                              </View>
                          )}
                          <Text>{item.text}</Text>
                      </View>
                  );
              }}
          />
          <View style={styles.inputContainer}>
              <TextInput
                  style={styles.input}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Nhập tin nhắn ở đây..."
              />
              {loadingResponse ? (
                  <TouchableOpacity style={styles.btnSend} disabled={true}>
                      <ActivityIndicator size={34} color="#0EE4C4" />
                  </TouchableOpacity>
              ) : (
                  <TouchableOpacity style={styles.btnSend} onPress={sendMessage}>
                      <MaterialIcons name="send" color="#0EE4C4" size={35}/>
                  </TouchableOpacity>
              )}
          </View>
      </KeyboardAvoidingView>
  );
};

export default ChatAI;

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
      marginBottom: 10,
  },
  avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 5,
  },
  senderName: {
      fontWeight: 'bold',
      marginLeft: 5,
      marginBottom: 0,
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
      minWidth: 300,
  },
  loadingContainer: {
      alignItems: 'center',
  },
  btnSend: {
      borderRadius: 45,
  },
  title: {
      textAlign: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 50,
      marginBottom: 20,
      marginTop: 25,
  },
  titleAvatar: {
      margin: 5,
      resizeMode: 'center',
      width: 220,
      height: 80,
  },
});
