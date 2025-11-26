import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from '../../chatbot/config.js';
import MessageParser from '../../chatbot/MessageParser.jsx';
import ActionProvider from '../../chatbot/ActionProvider.jsx';

const MebBot = () => {
  return (
    <div>
      <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
    </div>
  );
};

export default MebBot;