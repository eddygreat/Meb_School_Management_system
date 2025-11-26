import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      actions.handleHello();
    } else if (lowerCaseMessage.includes('assignment') || lowerCaseMessage.includes('help')) {
      actions.handleAssignmentHelp();
    } else {
      actions.handleUnknown();
    }
  };

  return (
    <div>{React.Children.map(children, (child) => React.cloneElement(child, { parse }))}</div>
  );
};

export default MessageParser;