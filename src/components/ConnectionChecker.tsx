import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { testGeminiAPIConnection } from '../services/geminiService';

interface ConnectionCheckerProps {
  onConnectionSuccess: () => void;
}

export const ConnectionChecker: React.FC<ConnectionCheckerProps> = ({ onConnectionSuccess }) => {
  const [checking, setChecking] = useState(true);
  const [connectionFailed, setConnectionFailed] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    setConnectionFailed(false);
    try {
      const isConnected = await testGeminiAPIConnection();
      if (isConnected) {
        onConnectionSuccess();
      } else {
        setConnectionFailed(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionFailed(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#34495e" />
        <Text style={styles.text}>Checking connection...</Text>
      </View>
    );
  }

  if (connectionFailed) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>
          Could not connect to the Gemini API. Please check your internet connection and API key.
        </Text>
        <TouchableOpacity style={styles.button} onPress={checkConnection}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginTop: 15,
    color: '#333',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#e74c3c',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 