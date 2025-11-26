import React from 'react';

import './Options.css';

/**
 * A widget that displays clickable option buttons for the user.
 */
const Options = (props) => {
  const options = [
    { text: 'Exam Prep', handler: props.actionProvider.handleExamPrep, id: 1 },
    { text: 'Assignments', handler: props.actionProvider.handleAssignments, id: 2 },
    { text: 'Student Resources', handler: props.actionProvider.handleStudentResources, id: 3 },
  ];

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} onClick={option.handler} className="option-button">
      {option.text}
    </button>
  ));

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options;