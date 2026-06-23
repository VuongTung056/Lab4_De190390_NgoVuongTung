import React, { useState, useEffect } from 'react';
import { QuizContext } from './QuizContext';
import Question from './Question';
import Result from './Result';

const questions = [
  { id: 1, question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
  { id: 2, question: "What is the largest planet in our solar system?", options: ["Jupiter", "Saturn", "Mars", "Earth"], answer: "Jupiter" },
  { id: 3, question: "AAAAA?", options: ["AAAAA", "AA", "AAA", "A"], answer: "AAAAA" },
  { id: 4, question: "Who wrote 'Romeo and Juliet'?", options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Homer"], answer: "William Shakespeare" },
  { id: 5, question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: "7" }
];

function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false);

  // ✅ useEffect hiển thị câu hỏi hiện tại — đúng yêu cầu giảng viên
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  useEffect(() => {
    setCurrentQuestion(questions[currentIndex]);
  }, [currentIndex]);

  const handleSubmit = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizEnd(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizEnd(false);
  };

  return (
    <QuizContext.Provider value={{
      currentQuestion,  // ← do useEffect cập nhật
      currentIndex,
      total: questions.length,
      score,
      onSubmit: handleSubmit,
      onNext: handleNext,
      onRestart: handleRestart
    }}>
      <div>
        <h1>Quiz App</h1>
        <p>Score: {score}</p>
        {quizEnd ? <Result /> : <Question />}
      </div>
    </QuizContext.Provider>
  );
}

export default QuizApp;