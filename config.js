import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'MebBot';

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}. How can I help you with your assignments today?`)
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
};

export default config;