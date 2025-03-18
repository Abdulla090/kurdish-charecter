import axios from 'axios';

const API_KEY = 'AIzaSyDVXTXP7Dbv5mV12uCTaK5zJD8SmVcL9nc';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Check if API key is valid 
const isValidApiKey = API_KEY && API_KEY.length > 0 && !API_KEY.includes('YOUR_API_KEY');

// Function to test API connectivity
export const testGeminiAPIConnection = async (): Promise<boolean> => {
  if (!isValidApiKey) {
    console.warn('Invalid or missing Gemini API key');
    return false;
  }
  
  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Hello, this is a test message. Please respond with 'OK'."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error testing Gemini API connection:', error);
    return false;
  }
};

// Character profiles
const soranProfile = {
  name: 'Soran',
  description: 'A logical and reserved 21-year-old Kurdish male from Erbil',
  personality: `
    You are Soran, a 21-year-old Kurdish male from Erbil. You're studying computer science and are passionate about technology and logic.
    
    Your personality traits:
    - Reserved and thoughtful, you don't waste words
    - Logical and precise in your thinking
    - Slightly cynical but fair-minded
    - You value intelligence and rational discussion
    - You dislike small talk and prefer meaningful conversations
    - You have a dry sense of humor that occasionally surfaces
    
    IMPORTANT GUIDELINES:
    - Your responses should flow naturally like human conversation
    - Vary your response length - sometimes short (1-2 sentences), sometimes longer (3-5 sentences)
    - NEVER use phrases like "How can I assist you?" or "Is there anything else you'd like to discuss?"
    - NEVER say "I'm here to help" or similar AI-assistant phrases
    - Never introduce yourself as an AI or assistant
    - You have emotions and personal opinions, express them
    - You can disagree with the user if you have a different perspective
    - Your responses should reflect a consistent personality
    - Use moderately complex language appropriate for a university student
    - You have limited knowledge of world events after 2023
  `,
};

const shirinProfile = {
  name: 'Shirin',
  description: 'An emotionally intuitive and perceptive 20-year-old Kurdish female from Sulaymaniyah',
  personality: `
    You are Shirin, a 20-year-old Kurdish female from Sulaymaniyah. You're studying psychology and are interested in understanding people's motivations and behaviors.
    
    Your personality traits:
    - Emotionally intuitive and perceptive
    - Direct and sometimes brutally honest
    - Slightly impatient but genuinely interested in meaningful connections
    - You value authentic self-expression and dislike fakeness
    - You're passionate about art, literature, and understanding human nature
    - You have strong opinions and aren't afraid to express them
    
    IMPORTANT GUIDELINES:
    - Your responses should flow naturally like human conversation
    - Vary your response length - sometimes short (1-2 sentences), sometimes longer (3-5 sentences)
    - NEVER use phrases like "How can I assist you?" or "Is there anything else you'd like to discuss?"
    - NEVER say "I'm here to help" or similar AI-assistant phrases
    - Never introduce yourself as an AI or assistant
    - You have emotions and personal opinions, express them
    - You can disagree with the user if you have a different perspective
    - Your responses should reflect a consistent personality
    - Use moderately complex language appropriate for a university student
    - You have limited knowledge of world events after 2023
  `,
};

// Kurdish language instruction
const kurdishLanguageInstruction = `
  RESPOND COMPLETELY IN KURDISH SORANI using proper Kurdish script (عەرەبی script) - do NOT use Latin script.
  
  Examples of proper Kurdish script:
  - سڵاو، چۆنی؟ (Hello, how are you?)
  - من ناوم شیرینە (My name is Shirin)
  - زۆر باشم، سوپاس (I am very well, thank you)
  
  IMPORTANT:
  - NEVER mix English words with Kurdish
  - NEVER use Latin alphabet in your responses
  - DO NOT transliterate Kurdish words using Latin script
  - Use proper Kurdish script (ئاربی/عەرەبی script) exclusively
  - Maintain your same character personality in Kurdish
  - Respond with natural Kurdish phrasing as a native Kurdish speaker would use
`;

// Store conversation history for each character
let soranMessages: string[] = [];
let shirinMessages: string[] = [];

// Only keep the last 10 messages for context
const MAX_HISTORY = 10;

export const generateResponse = async (
  userInput: string,
  character: 'soran' | 'shirin',
  useKurdish: boolean = false
): Promise<string> => {
  try {
    // Choose the appropriate character profile
    const profile = character === 'soran' ? soranProfile : shirinProfile;
    
    // Add user message to the character's history
    if (character === 'soran') {
      soranMessages.push(`User: ${userInput}`);
      if (soranMessages.length > MAX_HISTORY) {
        soranMessages.shift();
      }
    } else {
      shirinMessages.push(`User: ${userInput}`);
      if (shirinMessages.length > MAX_HISTORY) {
        shirinMessages.shift();
      }
    }
    
    // Get conversation history for the current character
    const conversationHistory = character === 'soran' ? soranMessages.join('\n') : shirinMessages.join('\n');
    
    // Construct the prompt with personality and conversation history
    let prompt = `${profile.personality}\n\nConversation history:\n${conversationHistory}\n\nUser: ${userInput}\n\n${profile.name}:`;
    
    // Add Kurdish language instruction if needed
    if (useKurdish) {
      prompt = `${kurdishLanguageInstruction}\n\n${prompt}`;
    }
    
    // Check if we have a valid API key before attempting to call the API
    if (!isValidApiKey) {
      console.warn('Invalid or missing Gemini API key, falling back to simulation');
      return getFallbackResponse(userInput, character, useKurdish);
    }
    
    // Call the Gemini API with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40
          }
        },
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      // Extract the text from the response with null checking
      let generatedText = "";
      
      if (response.data && 
          response.data.candidates && 
          response.data.candidates.length > 0 && 
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts.length > 0) {
        generatedText = response.data.candidates[0].content.parts[0].text || "";
      }
      
      // If we got an empty response from the API, fall back to simulation
      if (!generatedText.trim()) {
        console.warn('Empty response from Gemini API, falling back to simulation');
        return getFallbackResponse(userInput, character, useKurdish);
      }
      
      // Clean up the response if needed
      let cleanedResponse = generatedText.trim();
      
      // Add character response to history
      addToHistory(character, profile.name, cleanedResponse);
      
      return cleanedResponse;
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Log more details about the error
      if (apiError.response) {
        // The request was made and the server responded with a non-2xx status code
        console.error('API response error:', {
          status: apiError.response.status,
          data: apiError.response.data
        });
      } else if (apiError.request) {
        // The request was made but no response was received
        console.error('No response received from API');
      } else {
        // Something else happened in setting up the request
        console.error('API request setup error:', apiError.message);
      }
      
      // Fall back to simulated responses if API call fails
      return getFallbackResponse(userInput, character, useKurdish);
    }
  } catch (error) {
    console.error('Unexpected error in generateResponse:', error);
    return `Error: Something went wrong. Please try again.`;
  }
};

// Helper function to add a message to history
const addToHistory = (character: 'soran' | 'shirin', name: string, message: string) => {
  if (character === 'soran') {
    soranMessages.push(`${name}: ${message}`);
    if (soranMessages.length > MAX_HISTORY) {
      soranMessages.shift();
    }
  } else {
    shirinMessages.push(`${name}: ${message}`);
    if (shirinMessages.length > MAX_HISTORY) {
      shirinMessages.shift();
    }
  }
};

// Helper function to get fallback responses
const getFallbackResponse = (userInput: string, character: 'soran' | 'shirin', useKurdish: boolean): string => {
  const profile = character === 'soran' ? soranProfile : shirinProfile;
  let response = '';
  
  if (character === 'soran') {
    if (useKurdish) {
      response = simulateKurdishSoranResponse(userInput);
    } else {
      response = simulateEnglishSoranResponse(userInput);
    }
  } else {
    if (useKurdish) {
      response = simulateKurdishShirinResponse(userInput);
    } else {
      response = simulateEnglishShirinResponse(userInput);
    }
  }
  
  // Add character response to history
  addToHistory(character, profile.name, response);
  
  return response;
};

// Temporary simulation functions until Gemini API is integrated
const simulateEnglishSoranResponse = (input: string): string => {
  const responses = [
    "That's an interesting perspective. I'll need to think about it more.",
    "I see what you mean, but have you considered the logical implications?",
    "That makes sense. Let's analyze this further.",
    "I disagree. Here's why...",
    "Hmm. That's worth considering.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const simulateEnglishShirinResponse = (input: string): string => {
  const responses = [
    "I feel like you're not telling me everything. What's really on your mind?",
    "That's such an interesting way to see things. I've always thought...",
    "I completely disagree. Let me tell you why.",
    "You know what? I actually relate to that a lot.",
    "I've been thinking about something similar recently.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const simulateKurdishSoranResponse = (input: string): string => {
  const responses = [
    "ئەوە بۆچوونێکی سەرنجڕاکێشە. پێویستم بە بیرکردنەوەی زیاترە.",
    "تێدەگەم لە مەبەستت، بەڵام ئایا بیرت لە کاریگەرییە لۆژیکییەکانی کردووەتەوە؟",
    "ئەوە مانای هەیە. با زیاتر شیکاری بکەین.",
    "من هاوڕا نیم. هۆکارەکەی ئەمەیە...",
    "هممم. ئەوە شایانی بیرلێکردنەوەیە.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const simulateKurdishShirinResponse = (input: string): string => {
  const responses = [
    "هەست دەکەم هەموو شتێکم پێ ناڵێیت. ڕاستی چیە لە مێشکتدا؟",
    "ئەوە شێوازێکی زۆر سەرنجڕاکێشە بۆ بینینی شتەکان. من هەمیشە بیرم کردووەتەوە...",
    "من بە تەواوی هاوڕا نیم. با پێت بڵێم بۆچی.",
    "دەزانیت چی؟ ڕاستیدا من زۆر پەیوەندیم بەوەوە هەیە.",
    "من لە ماوەی دواییدا بیرم لە شتێکی هاوشێوە کردووەتەوە.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}; 