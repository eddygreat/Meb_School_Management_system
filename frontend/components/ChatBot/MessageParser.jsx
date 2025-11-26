import React from 'react';

/**
 * The MessageParser decides what action to take based on the user's input.
 */
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      actions.handleHello();
    } else if (lowerCaseMessage.includes('exam') || lowerCaseMessage.includes('test')) {
      actions.handleExamPrep();
    } else if (lowerCaseMessage.includes('assignment') || lowerCaseMessage.includes('homework')) {
      actions.handleAssignments();
    } else if (lowerCaseMessage.includes('resource') || lowerCaseMessage.includes('help')) {
      actions.handleStudentResources();
    } else {
      // If the input doesn't match any keywords, you can have a default response
      actions.handleDefault();
    }
  };

  return (
    <div>{React.Children.map(children, (child) => React.cloneElement(child, { parse }))}</div>
  );
};

export default MessageParser;