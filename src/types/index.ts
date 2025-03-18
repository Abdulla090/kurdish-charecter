export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'soran' | 'shirin';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
}

export type RootStackParamList = {
  Home: undefined;
  SoranChat: undefined;
  ShirinChat: undefined;
}; 