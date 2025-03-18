import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { SoranChatScreen } from './src/screens/SoranChatScreen';
import { ShirinChatScreen } from './src/screens/ShirinChatScreen';
import { RootStackParamList } from './src/types';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1e272e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: '#f5f5f5',
              },
              headerBackTitle: 'Back',
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                title: 'Soran & Shirin - Hard-to-Impress Kurdish AI',
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen 
              name="SoranChat" 
              component={SoranChatScreen}
              options={{
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen 
              name="ShirinChat" 
              component={ShirinChatScreen}
              options={{
                headerTitleAlign: 'center',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}
