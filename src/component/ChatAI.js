import { Text, View, TextInput, Button, ToastAndroid, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native"
import React, { useState } from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleGenerativeAI  } from "@google/generative-ai"
import {API_KEY} from '@env'

const ChatAI = () => {
    const [prompt,setPrompt] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const handleGenerateContent = async () => { 
        try {
            if(!prompt.trim()){
                ToastAndroid.show('Hãy nhập prompt', ToastAndroid.SHORT)
                return;
            }
            setLoading(true)
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const result = await model.generateContent(prompt+". Hãy trả lời như một người bạn và trả lời 1 cách ngắn gọn");
            setText(result.response.text());
            setPrompt("");
        }
        catch (e){
            setText(e.message || e.toString());
        }
        finally{
            setLoading(false)
        }
    }
    return(
        <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chat with AI</Text>
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