import { Text, View, TextInput, Button } from "react-native"
import React, { useState } from "react"
import { GoogleGenerativeAI  } from "@google/generative-ai"
import {API_KEY} from '@env'

const ChatAI = () => {
    const [prompt,setPrompt] = useState('')
    const [text, setText] = useState('')
    const genAI = new GoogleGenerativeAI(API_KEY);
    const handleGenerateContent = async () => { 
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const result = await model.generateContent(prompt);
            setText(result.response.text());
        }
        catch (e){
            console.error("Error generating content:", error);
        }
    }
    return(
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
                <Button title="Generate" onPress={handleGenerateContent} />
            </View>
        </View>
    )
}
export default ChatAI