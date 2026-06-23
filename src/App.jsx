import React, { createContext, useContext, useEffect, useState } from 'react';

export const quizData = [
  {
    question: 'What is ReactJS?',
    answers: [
      'A JavaScript library for building user interfaces',
      'A programming language',
      'A database management system'
    ],
    correctAnswer: 'A JavaScript library for building user interfaces'
  },
  {
    question: 'What is JSX?',
    answers: [
      'A programming language',
      'A file format',
      'A syntax extension for JavaScript'
    ],
    correctAnswer: 'A syntax extension for JavaScript'
  },
  {
    question: 'Which Hook is used to manage state in a functional component?',
    answers: ['useEffect', 'useState', 'useContext'],
    correctAnswer: 'useState'
  },
  {
    question: 'What does useEffect do?',
    answers: [
      'Manages global state',
      'Performs side effects in function components',
      'Creates a new component'
    ],
    correctAnswer: 'Performs side effects in function components'
  },
  {
    question: 'What is the purpose of useContext?',
    answers: [
      'To fetch data from an API',
      'To share state across components without prop drilling',
      'To replace useState'
    ],
    correctAnswer: 'To share state across components without prop drilling'
  }
];

const QuizContext = createContext(null);

function QuizProvider({ children }) {
  const [quizList, setQuizList] = useState(quizData);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const newScore = quizList.reduce((count, item, index) => {
      return selectedAnswers[index] === item.correctAnswer ? count + 1 : count;
    }, 0);
    setScore(newScore);
  }, [selectedAnswers, quizList]);

  const addQuestion = (question, answers, correctAnswer) => {
    setQuizList((current) => [
      ...current,
      { question, answers, correctAnswer }
    ]);
    setSubmitted(false);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData: quizList,
        selectedAnswers,
        setSelectedAnswers,
        score,
        submitted,
        setSubmitted,
        addQuestion
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}

function AddQuestionForm() {
  const { addQuestion } = useQuiz();
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [correctOption, setCorrectOption] = useState('A');

  const handleAddQuestion = () => {
    if (
      !questionText.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim()
    ) {
      return;
    }

    const answers = [optionA.trim(), optionB.trim(), optionC.trim()];
    const correctAnswer =
      correctOption === 'A'
        ? answers[0]
        : correctOption === 'B'
        ? answers[1]
        : answers[2];

    addQuestion(questionText.trim(), answers, correctAnswer);
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setCorrectOption('A');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Thêm câu hỏi mới</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nội dung câu hỏi</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Nhập câu hỏi"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Đáp án A</label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Option A"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Đáp án B</label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Option B"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Đáp án C</label>
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="Option C"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Đáp án đúng</span>
          {['A', 'B', 'C'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCorrectOption(option)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                correctOption === option
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, index }) {
  const { selectedAnswers, setSelectedAnswers, submitted } = useQuiz();
  const selected = selectedAnswers[index] || '';

  const handleSelect = (answer) => {
    if (submitted) {
      return;
    }
    setSelectedAnswers((current) => ({
      ...current,
      [index]: answer
    }));
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Question {index + 1}
        </span>
        <span className="text-sm text-slate-500">{question.question}</span>
      </div>

      <div className="grid gap-3">
        {question.answers.map((answer) => {
          const isSelected = selected === answer;
          const isCorrect = submitted && answer === question.correctAnswer;
          const isWrong = submitted && isSelected && answer !== question.correctAnswer;

          return (
            <button
              key={answer}
              type="button"
              onClick={() => handleSelect(answer)}
              className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                isCorrect
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                  : isWrong
                  ? 'border-red-400 bg-red-100 text-red-900'
                  : isSelected
                  ? 'border-blue-400 bg-blue-100 text-slate-900'
                  : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizList() {
  const { quizData } = useQuiz();

  useEffect(() => {
    console.log('Quiz updated:', quizData);
  }, [quizData]);

  return (
    <div className="space-y-4">
      {quizData.map((question, index) => (
        <QuestionCard key={index} question={question} index={index} />
      ))}
    </div>
  );
}

function ScoreBoard() {
  const {
    score,
    quizData,
    submitted,
    setSubmitted,
    setSelectedAnswers
  } = useQuiz();

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-lg font-semibold text-slate-900">
        {submitted
          ? `Bạn đúng ${score}/${quizData.length} câu`
          : 'Chọn đáp án cho từng câu hỏi rồi nhấn Submit Quiz'}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Submit Quiz
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  React Hooks Quiz
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                  Lab 4: useState, useEffect, useContext
                </h1>
              </div>
              <div className="rounded-3xl bg-blue-50 px-5 py-3 text-sm text-blue-700">
                Light theme, responsive, clean layout
              </div>
            </div>
            <p className="text-slate-600">
              Thêm câu hỏi, chọn đáp án và kiểm tra ngay. App sử dụng Context để chia sẻ
              trạng thái, useState để quản lý form và useEffect để tính điểm + log quiz.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <AddQuestionForm />
              <ScoreBoard />
            </div>
            <div>
              <QuizList />
            </div>
          </div>
        </div>
      </div>
    </QuizProvider>
  );
}

export default App;
