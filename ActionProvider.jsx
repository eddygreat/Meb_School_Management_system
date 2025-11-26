import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage('Hello. Nice to meet you.');
    addMessageToState(botMessage);
  };

  const handleAssignmentHelp = () => {
    const botMessage = createChatBotMessage(
      "I can help with that. Which subject are you working on? Math, Science, or History?"
    );
    addMessageToState(botMessage);
  };

  const handleUnknown = () => {
    const botMessage = createChatBotMessage("I'm not sure how to help with that. Can you try rephrasing?");
    addMessageToState(botMessage);
  };

  const addMessageToState = (botMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>{React.Children.map(children, (child) => React.cloneElement(child, { actions: { handleHello, handleAssignmentHelp, handleUnknown } }))}</div>
  );
};

export default ActionProvider;