import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';

const Result = () => {
  const { score, total, onRestart } = useContext(QuizContext);
      

    return (
      <div>
        <h2>Quiz Ended</h2>
        <p>Your Score: {score} / {total}</p>
        <button onClick={onRestart}>Play Again</button>
      </div>
    );
}


export default Result;