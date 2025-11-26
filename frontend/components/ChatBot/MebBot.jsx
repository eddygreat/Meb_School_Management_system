import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './MebBot.css'; // Import custom styles for the chatbot container

import config from './config.jsx';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';

/**
 * MebBot component renders the main chatbot interface.
 * It integrates the react-chatbot-kit with a custom configuration,
 * message parser, and action provider.
 */
const MebBot = () => {
  return (
    <div className="meb-bot-container">
      <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
    </div>
  );
};

export default MebBot;