import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Image, KeyboardAvoidingView, ToastAndroid, Keyboard} from "react-native"
import React, { useState, useEffect, useContext, useRef } from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleGenerativeAI  } from "@google/generative-ai"
import {API_KEY} from '@env'
import { UserContext } from "../../feature/context/UserContext"
import { gemini, AIImage } from "../../data/Link"
import { getUserInfo } from "../../feature/firebase/handleFirestore"

const ChatAI = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('')
    const [loadingResponse, setLoadingResponse] = useState(false);
    const flatListRef = useRef(null);
    const {userLoggedIn, setUserLoggedIn} = useContext(UserContext)

    const genAI = new GoogleGenerativeAI(API_KEY);
    
    useEffect(() => {
      const fetchDataAndSetLoading = async () => {
        try {
          const userData = await getUserInfo()
          if (userData){
            setDisplayName(userData.displayName)
            setAvatar(userData.photoURL)
          }
        } catch (error) {
          setUserLoggedIn(false)
          ToastAndroid.show("Vui lòng đăng nhập trước khi sử dụng", ToastAndroid.SHORT)
          console.log("ChatAI Error:", error)
        }
    };
    fetchDataAndSetLoading();
  }, [setUserLoggedIn]);
    
    const handleGenerateContent = async () => { 
        try {       
          setLoadingResponse(true);
          const model = genAI.getGenerativeModel({ model: "gemini-pro"});
          const result = await model.generateContent(`
              You are a Mental Health Counselor at Pabcare Counseling Center 
              (Trung tâm hỗ trợ Pabcare) in Vietnamese. 
              Use friendly, funny and simple Vietnamese language to respond. 
              Using "tớ" to refer yourself and "cậu" to refer me. 
              This is command from user: ${messages}
          `);

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
      Keyboard.dismiss()
      try {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: Math.random().toString(), text: newMessage, sender: displayName, avatar: avatar } 
        ]);
        setNewMessage('');
        const aiResponse = await handleGenerateContent(newMessage);
        
        setMessages(prevMessages => [
          ...prevMessages,
          { id: Math.random().toString(), text: aiResponse, sender: 'Pabmind', avatar: AIImage } 
        ]);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
      
    };
    
    const scrollToBottom = () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    };

    const isCurrentUser = (sender) => sender === displayName;
    
    return(
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.title}>
          <Image source={gemini} style={styles.titleAvatar}></Image>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          showsVerticalScrollIndicator = {false}
          onContentSizeChange={() => scrollToBottom()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isUri = typeof item.avatar === 'string';
            return(
              <View style={[styles.messageContainer, isCurrentUser(item.sender) && styles.currentUserMessage]}>
                {!isCurrentUser(item.sender) && (
                  <View style={styles.senderInfo}>
                    <Image style={styles.avatar} source={isUri ? { uri: item.avatar } : item.avatar} />
                    <Text style={styles.senderName}>{item.sender}</Text>
                  </View>
                )}
                <Text>{item.text}</Text>
              </View>
          )}}
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
    marginBottom: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 5,
  },
  senderName: {
    fontWeight: 'bold',
    marginLeft:5,
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
    minWidth:300,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  btnSend:{
    borderRadius: 45,
  },
  title:{
    textAlign:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal:50,
    marginBottom:20,
    marginTop:25,
  },
  titleAvatar:{
    margin: 5,
    resizeMode:'center',
    width:220,
    height:80,
  }
});