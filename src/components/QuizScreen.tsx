import { useState, useEffect } from "react";
import { QuizData, QuizResult } from "./QuizApp";

interface QuizScreenProps {
  quiz: QuizData;
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
}

export function QuizScreen({ quiz, onFinish, onBack }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per quiz

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentAnswer !== null) return;
    setCurrentAnswer(answerIndex);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentAnswer === null) return;

    const newAnswers = [...selectedAnswers, currentAnswer];
    setSelectedAnswers(newAnswers);

    if (isLastQuestion) {
      handleFinish(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleFinish = (answers = [...selectedAnswers, currentAnswer].filter(a => a !== null)) => {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index]?.correctAnswer ? 1 : 0);
    }, 0);

    const timeSpent = 300 - timeLeft; // Calculate time spent
    const isPerfectScore = score === quiz.questions.length;

    onFinish({
      score,
      totalQuestions: quiz.questions.length,
      timeSpent,
      isPerfectScore,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-secondary hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyColor(quiz.difficulty || 'Beginner')}`}>
              <span className="hidden sm:inline">Level {quiz.level || 1} - </span>{quiz.difficulty || 'Beginner'}
            </span>
            <div className={`text-sm sm:text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-primary'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark">{quiz.title}</h2>
            <p className="text-sm sm:text-base text-secondary">{quiz.description || 'Quiz description'}</p>
          </div>
          <span className="text-xs sm:text-sm text-secondary">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-dark mb-4 sm:mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option: string, index: number) => {
            let buttonClass = "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ";
            
            if (showExplanation) {
              if (index === question.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-700";
              } else if (index === currentAnswer && index !== question.correctAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-400";
              }
            } else if (currentAnswer === index) {
              buttonClass += "border-primary bg-primary/10 text-primary";
            } else {
              buttonClass += "border-gray-200 hover:border-primary/50 hover:bg-primary/5";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={currentAnswer !== null}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-3 text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                  {showExplanation && index === question.correctAnswer && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                  {showExplanation && index === currentAnswer && index !== question.correctAnswer && (
                    <span className="ml-auto text-red-600">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">💡</span>
              <div>
                <div className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Explanation:</div>
                <div className="text-blue-700 text-xs sm:text-sm">{question.explanation}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="text-xs sm:text-sm text-secondary text-center sm:text-left">
          {currentAnswer !== null && showExplanation ? (
            currentAnswer === question.correctAnswer ? (
              <span className="text-green-600 font-medium">✓ Correct!</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Incorrect</span>
            )
          ) : (
            "Select an answer to continue"
          )}
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentAnswer === null}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all text-sm sm:text-base"
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 sm:mt-6">
        {quiz.questions.map((_: any, index: number) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index < currentQuestion
                ? "bg-green-500"
                : index === currentQuestion
                ? "bg-primary"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
