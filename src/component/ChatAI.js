import { Text, View, TextInput, Button, ToastAndroid, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native"
import React, { useState } from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleGenerativeAI  } from "@google/generative-ai"
import auth from '@react-native-firebase/auth';
import {API_KEY} from '@env'

const ChatAI = () => {
    const [prompt,setPrompt] = useState('')
    const [text, setText] = useState('')
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)
    const genAI = new GoogleGenerativeAI(API_KEY);

    const checkUserExist = () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setEmail(currentUser.email.split('@')[0]);
        // User is signed in
      } else {
        // No user is signed in
        navigation.navigate('loginscreen');
      }
    };
    
    const handleGenerateContent = async () => { 
        checkUserExist()
        try {
            if(!prompt.trim()){
                ToastAndroid.show('Hãy nhập prompt', ToastAndroid.SHORT)
                return;
            }
            setLoading(true)
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const result = await model.generateContent("You're a Mental Health Counselor at Pabcare Counseling Center " 
                                                        +"(Trung tâm hỗ trợ Pabcare) in Vietnamese."
                                                        +" Use friendly, funny and simple Vietnamese language to respond." 
                                                        +" Using 'tớ' to refer yourself and 'cậu' to refer me "
                                                        +" This is a promt: " + prompt);
            setText(result.response.text());
            setPrompt("");
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
            setLoading(false)
        }
    }
    return(
        <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chat with AI {email}</Text>
          </View>
  
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
  
          <View style={styles.messageRespond}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={prompt}
              onChangeText={setPrompt}
            />
  
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleGenerateContent}
              disabled={loading}
            >
              <MaterialIcons name="send" size={30} />
            </TouchableOpacity>
  
            {loading && <ActivityIndicator style={styles.activityIndicator} />}
          </View>
        </View>
      </ScrollView>
    )
}
export default ChatAI

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    titleContainer: {
      marginBottom: 5,
      backgroundColor: "#25db2e",
      borderRadius: 10,
      padding: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    messageContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      minHeight: 200,
      borderRadius: 5,
      marginBottom: 10
    },
    messageText: {
      fontSize: 14,
      fontWeight: "100",
    },
    messageRespond: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 8,
      flex: 1,
    },
    sendButton: {
      padding: 10,
    },
    activityIndicator: {
      marginTop: 16,
    },
  });