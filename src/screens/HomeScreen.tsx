import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { CharacterProfile } from '../components/ChatScreen';
import { ConnectionChecker } from '../components/ConnectionChecker';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const characterProfiles: Record<'soran' | 'shirin', CharacterProfile> = {
  soran: {
    name: 'Soran',
    description: 'Logical & Reserved',
    color: '#34495e',
    secondaryColor: '#2c3e50',
    avatarText: '🧠',
    bio: 'A logical 21-year-old Kurdish male from Erbil who values precision and intellect. Computer science student with a dry sense of humor.',
  },
  shirin: {
    name: 'Shirin',
    description: 'Perceptive & Guarded',
    color: '#9b59b6',
    secondaryColor: '#8e44ad',
    avatarText: '🔮',
    bio: 'A perceptive 20-year-old Kurdish female from Sulaymaniyah with an intuitive understanding of people. Psychology student who is direct and values authenticity.',
  },
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [apiConnected, setApiConnected] = useState(false);
  
  const handleConnectionSuccess = () => {
    setApiConnected(true);
  };

  if (!apiConnected) {
    return <ConnectionChecker onConnectionSuccess={handleConnectionSuccess} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choose a Character to Chat With</Text>
        <Text style={styles.subtitle}>Both are Kurdish AI chatbots with unique personalities</Text>
        
        <View style={styles.characterContainer}>
          <TouchableOpacity
            style={[styles.characterCard, { borderColor: characterProfiles.soran.color }]}
            onPress={() => navigation.navigate('SoranChat')}
          >
            <View style={[styles.characterHeader, { backgroundColor: characterProfiles.soran.color }]}>
              <Text style={styles.characterEmoji}>{characterProfiles.soran.avatarText}</Text>
              <Text style={styles.characterName}>{characterProfiles.soran.name}</Text>
            </View>
            <View style={styles.characterBody}>
              <Text style={styles.characterDescription}>{characterProfiles.soran.description}</Text>
              <Text style={styles.characterBio}>{characterProfiles.soran.bio}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.chatButton, { backgroundColor: characterProfiles.soran.color }]}
                  onPress={() => navigation.navigate('SoranChat')}
                >
                  <Text style={styles.chatButtonText}>Try Talking to Soran</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.characterCard, { borderColor: characterProfiles.shirin.color }]}
            onPress={() => navigation.navigate('ShirinChat')}
          >
            <View style={[styles.characterHeader, { backgroundColor: characterProfiles.shirin.color }]}>
              <Text style={styles.characterEmoji}>{characterProfiles.shirin.avatarText}</Text>
              <Text style={styles.characterName}>{characterProfiles.shirin.name}</Text>
            </View>
            <View style={styles.characterBody}>
              <Text style={styles.characterDescription}>{characterProfiles.shirin.description}</Text>
              <Text style={styles.characterBio}>{characterProfiles.shirin.bio}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.chatButton, { backgroundColor: characterProfiles.shirin.color }]}
                  onPress={() => navigation.navigate('ShirinChat')}
                >
                  <Text style={styles.chatButtonText}>Try Talking to Shirin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  characterContainer: {
    gap: 20,
  },
  characterCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  characterHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 30,
    marginRight: 10,
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  characterBody: {
    padding: 15,
  },
  characterDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  characterBio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    color: '#666',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  chatButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 