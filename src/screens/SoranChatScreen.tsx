import React from 'react';
import { ChatScreen, CharacterProfile } from '../components/ChatScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';

const soranProfile: CharacterProfile = {
  name: 'Soran',
  description: 'Logical & Reserved',
  color: '#34495e',
  secondaryColor: '#2c3e50',
  avatarText: '🧠',
  bio: 'A logical 21-year-old Kurdish male from Erbil who values precision and intellect. Computer science student with a dry sense of humor.',
};

export const SoranChatScreen = () => {
  return (
    <ErrorBoundary>
      <ChatScreen character="soran" profile={soranProfile} />
    </ErrorBoundary>
  );
}; 