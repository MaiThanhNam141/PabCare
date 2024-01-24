import { Text, View, TextInput, Button, ToastAndroid, ScrollView, ActivityIndicator } from "react-native"
import React, { useState } from "react"
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
            const result = await model.generateContent(prompt);
            setText(result.response.text());
        }
        catch (e){
            setText(e)
        }
        finally{
            setLoading(false)
        }
    }
    return(
        <ScrollView>
            <View style={{ padding: 16 }}>
                <View style={{ marginBottom: 16 }}>
                    <Text>Chat with AI:</Text>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, minHeight: 100 }}>
                    <Text>{text}</Text>
                </View>

                <View style={{ marginTop: 16 }}>
                    <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
                    placeholder="Type your message..."
                    value={prompt}
                    onChangeText={setPrompt}
                    />
                    <Button title="Generate" onPress={handleGenerateContent} disabled={loading}/>
                    {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
                </View>
            </View>
        </ScrollView>
    )
}
export default ChatAI