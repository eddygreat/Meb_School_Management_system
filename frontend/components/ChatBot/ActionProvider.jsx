import React from 'react';
import apiClient from '@components/api';

/**
 * The ActionProvider defines the actions the chatbot can take.
 */
const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const handleAIResponse = async (message) => {
    try {
      // Use apiClient to ensure auth token is included
      const { data } = await apiClient.post('/ai/chat', { message });

      const botMessage = createChatBotMessage(data.response || "I'm having trouble connecting to my brain right now.");
      addMessageToState(botMessage);

    } catch (error) {
      console.error("AI Error:", error);
      const botMessage = createChatBotMessage("Sorry, I'm having trouble connecting to the server.");
      addMessageToState(botMessage);
    }
  };

  // Helper function to add a message to the chatbot state
  const addMessageToState = (botMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // Put the actions in the `actions` object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleAIResponse,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;