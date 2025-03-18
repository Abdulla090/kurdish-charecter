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
  Switch,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../types';
import { generateResponse } from '../services/geminiService';
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';

// Character profile interfaces
export interface CharacterProfile {
  name: string;
  description: string;
  color: string;
  secondaryColor: string;
  avatarText: string;
  bio: string;
}

interface ChatScreenProps {
  character: 'soran' | 'shirin';
  profile: CharacterProfile;
}

export const ChatScreen = ({ character, profile }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kurdishLanguage, setKurdishLanguage] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: character === 'soran' 
        ? "So you want to talk to me? What about?" 
        : "I'm Shirin. What do you want to talk about? I hope it's worth my time.",
      sender: character,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);

    // Set screen options with character's name
    navigation.setOptions({
      title: `Chat with ${profile.name}`,
      headerStyle: {
        backgroundColor: profile.color,
      }
    });
  }, []);

  // Toggle language and add a system message
  const toggleLanguage = () => {
    const newValue = !kurdishLanguage;
    setKurdishLanguage(newValue);
    
    // Add message about language change
    const languageMessage: Message = {
      id: Date.now().toString(),
      text: newValue 
        ? "گۆڕین بۆ زمانی کوردی." 
        : "Switching to English language.",
      sender: character,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, languageMessage]);
  };

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
    
    // Scroll to bottom after sending the message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await generateResponse(inputText, character, kurdishLanguage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: character,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Scroll to bottom after receiving the response
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: kurdishLanguage
          ? (character === 'soran' 
              ? "ناتوانم قسە بکەم. کێشەی تەکنیکی هەیە." 
              : "ببورە، کێشەیەک هەیە. دواتر هەوڵ بدەوە.")
          : (character === 'soran' 
              ? "Not interested in talking right now. Something's wrong with the connection." 
              : "Technical issues. Try again later if you must."),
        sender: character,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Scroll to bottom after error message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Add this effect to scroll when loading state changes
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isLoading]);

  // Add animated values for the typing dots
  const typingAnimations = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current
  ];
  
  // Start and loop the typing animation
  useEffect(() => {
    if (isLoading) {
      const animations = typingAnimations.map((anim, index) => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: index * 200,
            easing: Easing.ease,
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true
          })
        ]);
      });
      
      const loopAnimations = Animated.loop(
        Animated.stagger(150, animations)
      );
      
      loopAnimations.start();
      
      return () => {
        loopAnimations.stop();
        typingAnimations.forEach(anim => {
          anim.setValue(0.3);
        });
      };
    }
  }, [isLoading]);

  // Custom markdown style that adapts to message sender
  const getMarkdownStyles = (isUser: boolean) => ({
    body: {
      color: isUser ? '#fff' : '#fff',
      fontSize: 16,
      lineHeight: 22,
    },
    paragraph: {
      marginVertical: 0,
      lineHeight: 22,
    },
    strong: {
      fontWeight: 'bold',
      color: isUser ? '#fff' : '#fff',
    },
    em: {
      fontStyle: 'italic',
      color: isUser ? '#fff' : '#fff',
    },
    link: {
      color: isUser ? '#b3d9ff' : '#b3d9ff',
      textDecorationLine: 'underline',
    },
    bullet_list: {
      marginTop: 5,
      marginBottom: 5,
    },
    ordered_list: {
      marginTop: 5,
      marginBottom: 5,
    },
    heading1: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 5,
      color: isUser ? '#fff' : '#fff',
    },
    heading2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 5,
      color: isUser ? '#fff' : '#fff',
    },
    heading3: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 5,
      color: isUser ? '#fff' : '#fff',
    },
    code_inline: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
      padding: 3,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontSize: 14,
    },
  });

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const markdownStyles = getMarkdownStyles(isUser);
    
    return (
      <View
        style={[
          styles.messageContainer,
          isUser 
            ? styles.userMessage 
            : [styles.botMessage, { backgroundColor: item.sender === 'soran' ? '#34495e' : '#9b59b6' }],
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile.avatarText}
            </Text>
          </View>
        )}
        
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageSender,
            !isUser && { color: '#f0f0f0' }
          ]}>
            {isUser ? 'You' : profile.name}
          </Text>
          
          {(() => {
            try {
              return (
                <Markdown style={markdownStyles}>
                  {item.text}
                </Markdown>
              );
            } catch (error) {
              console.error('Markdown rendering error:', error);
              return (
                <Text style={{ color: isUser ? '#fff' : '#fff', fontSize: 16 }}>
                  {item.text}
                </Text>
              );
            }
          })()}
          
          <Text style={[
            styles.messageTime,
            !isUser && { color: '#e0e0e0' }
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  // Add a function to handle key press
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.languageToggleContainer}>
        <Text style={styles.languageLabel}>English</Text>
        <Switch
          trackColor={{ false: '#767577', true: profile.color }}
          thumbColor={kurdishLanguage ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLanguage}
          value={kurdishLanguage}
        />
        <Text style={styles.languageLabel}>کوردی</Text>
        <View style={styles.kurdishFlag}>
          <Text style={styles.flagText}>🟢🔴⚪🟡</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ListFooterComponent={isLoading ? (
          <View style={[
            styles.messageContainer, 
            styles.botMessage, 
            { 
              backgroundColor: character === 'soran' ? '#34495e' : '#9b59b6',
              opacity: 0.7,
              maxWidth: '60%'
            }
          ]}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profile.avatarText}
              </Text>
            </View>
            <View style={styles.messageContent}>
              <Text style={[styles.messageSender, { color: '#f0f0f0' }]}>
                {profile.name}
              </Text>
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>{kurdishLanguage ? "دەنووسێت" : "typing"}</Text>
                <View style={styles.typingDots}>
                  {typingAnimations.map((anim, index) => (
                    <Animated.View 
                      key={index}
                      style={[
                        styles.typingDot, 
                        { 
                          opacity: anim,
                          transform: [{ 
                            scale: anim.interpolate({
                              inputRange: [0.3, 1],
                              outputRange: [0.8, 1.2]
                            }) 
                          }]
                        }
                      ]} 
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : null}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={kurdishLanguage 
            ? "تکایە شتێک بنووسە..." 
            : (character === 'soran' 
                ? 'Say something interesting...' 
                : 'What do you want to say?')}
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            !inputText.trim() && styles.sendButtonDisabled,
            inputText.trim() && { backgroundColor: profile.color }
          ]}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>{kurdishLanguage ? "ناردن" : "Send"}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  languageToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageLabel: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  kurdishFlag: {
    marginLeft: 5,
  },
  flagText: {
    fontSize: 16,
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
  avatarText: {
    fontSize: 20,
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
    backgroundColor: '#f5f5f5',
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
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    opacity: 0.7,
  },
}); 