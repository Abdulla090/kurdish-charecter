import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../types';
import { generateResponse } from '../services/geminiService';

// Character profiles for UI elements
const characterProfiles = {
  soran: {
    name: 'Soran',
    description: '21-year-old, logical thinker, direct but caring',
    color: '#2c3e50', // Deep blue for a more serious tone
    secondaryColor: '#34495e',
    avatarText: '👨‍💻',
  },
  shirin: {
    name: 'Shirin',
    description: '20-year-old, empathetic, intuitive, nurturing',
    color: '#8e44ad', // Purple for warmth and creativity
    secondaryColor: '#9b59b6',
    avatarText: '👩‍⚕️',
  },
};

export const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedBot, setSelectedBot] = useState<'soran' | 'shirin'>('soran');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: selectedBot === 'soran' 
        ? "Hey there. I'm Soran. I'm pretty straightforward and logical, so don't expect me to sugarcoat things. But I'll always give you honest advice. What's on your mind?" 
        : "Hi! I'm Shirin. I'm here to listen and understand what you're going through. I can feel when something's bothering you, and I want to help. What would you like to talk about today?",
      sender: selectedBot,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Change welcome message when bot changes
  useEffect(() => {
    if (messages.length > 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: selectedBot === 'soran' 
          ? "I see you want to talk to me now. What's up? I'll give you my honest take." 
          : "You've switched to talking with me now. I can sense what you might be feeling. Let me know what's on your mind, and we can work through it together.",
        sender: selectedBot,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
    }
  }, [selectedBot]);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputText, selectedBot);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: selectedBot,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedBot === 'soran' 
          ? "Sorry, I'm having some technical issues. Let's try again in a moment." 
          : "I'm really sorry, but something went wrong with our connection. I hope we can continue our conversation soon.",
        sender: selectedBot,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' 
          ? styles.userMessage 
          : item.sender === 'soran' 
            ? [styles.botMessage, { backgroundColor: characterProfiles.soran.secondaryColor }]
            : [styles.botMessage, { backgroundColor: characterProfiles.shirin.secondaryColor }],
      ]}
    >
      {item.sender !== 'user' && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.sender === 'soran' 
              ? characterProfiles.soran.avatarText 
              : characterProfiles.shirin.avatarText}
          </Text>
        </View>
      )}
      
      <View style={styles.messageContent}>
        <Text style={[
          styles.messageSender,
          item.sender !== 'user' && { color: '#f0f0f0' }
        ]}>
          {item.sender === 'user' ? 'You' : item.sender === 'soran' ? 'Soran' : 'Shirin'}
        </Text>
        <Text style={[
          styles.messageText,
          item.sender !== 'user' && { color: '#fff' }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender !== 'user' && { color: '#e0e0e0' }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.botSelector}>
        <TouchableOpacity
          style={[
            styles.botButton,
            selectedBot === 'soran' && [styles.selectedBot, { backgroundColor: characterProfiles.soran.color }],
          ]}
          onPress={() => setSelectedBot('soran')}
        >
          <Text style={styles.avatarText}>{characterProfiles.soran.avatarText}</Text>
          <Text style={[
            styles.botButtonText,
            selectedBot === 'soran' && styles.selectedBotText,
          ]}>
            {characterProfiles.soran.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.botButton,
            selectedBot === 'shirin' && [styles.selectedBot, { backgroundColor: characterProfiles.shirin.color }],
          ]}
          onPress={() => setSelectedBot('shirin')}
        >
          <Text style={styles.avatarText}>{characterProfiles.shirin.avatarText}</Text>
          <Text style={[
            styles.botButtonText,
            selectedBot === 'shirin' && styles.selectedBotText,
          ]}>
            {characterProfiles.shirin.name}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={selectedBot === 'soran' 
              ? characterProfiles.soran.color 
              : characterProfiles.shirin.color} 
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Ask ${selectedBot} something...`}
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            !inputText.trim() && styles.sendButtonDisabled,
            inputText.trim() && { 
              backgroundColor: selectedBot === 'soran' 
                ? characterProfiles.soran.color 
                : characterProfiles.shirin.color 
            }
          ]}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  botSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  botButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBot: {
    backgroundColor: '#0066cc',
  },
  botButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  selectedBotText: {
    color: '#fff',
  },
  avatarText: {
    fontSize: 20,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '85%',
    marginVertical: 8,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  messageContent: {
    flex: 1,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0066cc',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#4a4a4a',
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 4,
    color: '#e0e0e0',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    color: '#e0e0e0',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
}); 