import React from 'react';

const QuestionList = ({ questions }) => {
  if (!questions.length) {
    return <p>No results found.</p>;
  }
  if (!questions.length) {
    return <p className="error-message">No questions match the selected filter.</p>;
  }

  return (
    <ul className="list-group">
      {questions.map((question, index) => (
        <li key={index} className="list-group-item">
          <h5>{question.title}</h5>
          <p>Type: {question.type}</p>

          {/* ANAGRAM: Display options (blocks) */}
          {question.type === 'ANAGRAM' && question.blocks && (
            <div className="answer-block">
              <p>Options:</p>
              <div className="blocks">
                {question.blocks
                  .filter((block) => block.showInOption) // Only show blocks with showInOption: true
                  .map((block, idx) => (
                    <div key={idx} className={`block ${block.isAnswer ? 'answer' : ''}`}>
                      {block.text}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ANAGRAM: Display solution */}
          {question.type === 'ANAGRAM' && question.solution && (
            <div className="answer-block">
              <p>Solution:</p>
              <div className="block">{question.solution}</div>
            </div>
          )}

          {/* MCQ: Display options */}
          {question.type === 'MCQ' && question.options && (
            <div className="answer-block">
              <p>Options:</p>
              <div>
                {question.options.map((option, idx) => (
                  <div key={idx} className={`option ${option.isCorrectAnswer ? 'correct' : 'incorrect' }`} >
                    {option.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

};

export default QuestionList;