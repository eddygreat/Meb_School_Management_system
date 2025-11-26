import { createChatBotMessage } from 'react-chatbot-kit';
import Options from './Options.jsx';

const botName = 'MebBot';

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(
      `Hi! I'm ${botName}. I'm here to help you with exam prep, assignments, and student resources. What would you like to focus on?`,
      {
        widget: 'options',
      }
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => <Options {...props} />,
    },
  ],
};

export default config;