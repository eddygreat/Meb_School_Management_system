import React from 'react';

/**
 * The ActionProvider defines the actions the chatbot can take.
 */
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage('Hello there! How can I assist you today?');
    addMessageToState(botMessage);
  };

  const handleExamPrep = () => {
    const botMessage = createChatBotMessage(
      "Great! For exam prep, I recommend starting with a study plan, reviewing past papers, and taking short breaks. Don't forget to get enough sleep!"
    );
    addMessageToState(botMessage);
  };

  const handleAssignments = () => {
    const botMessage = createChatBotMessage(
      "For assignments, make sure to read the instructions carefully. Breaking the task into smaller parts can make it more manageable. What subject are you working on?"
    );
    addMessageToState(botMessage);
  };

  const handleStudentResources = () => {
    const botMessage = createChatBotMessage(
      'You can find helpful resources at the student portal, including the library, academic advising, and tutoring services. Is there a specific resource you need?'
    );
    addMessageToState(botMessage);
  };

  const handleDefault = () => {
    const botMessage = createChatBotMessage(
      "I'm sorry, I don't understand. You can ask me about 'exam prep', 'assignments', or 'student resources'."
    );
    addMessageToState(botMessage);
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
            handleHello,
            handleExamPrep,
            handleAssignments,
            handleStudentResources,
            handleDefault,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;