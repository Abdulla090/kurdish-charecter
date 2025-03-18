import React from 'react';
import { ChatScreen, CharacterProfile } from '../components/ChatScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';

const shirinProfile: CharacterProfile = {
  name: 'Shirin',
  description: 'Perceptive & Guarded',
  color: '#9b59b6',
  secondaryColor: '#8e44ad',
  avatarText: '🔮',
  bio: 'A perceptive 20-year-old Kurdish female from Sulaymaniyah with an intuitive understanding of people. Psychology student who is direct and values authenticity.',
};

export const ShirinChatScreen = () => {
  return (
    <ErrorBoundary>
      <ChatScreen character="shirin" profile={shirinProfile} />
    </ErrorBoundary>
  );
}; 