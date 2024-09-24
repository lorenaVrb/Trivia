import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchQuestions } from '../api';
import '../App.css'; 

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, categoryId, categoryName } = location.state || {};

  // Default to a safe category name if undefined
  const safeCategoryName = categoryName || 'default';

  // State initialization
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState(questions || []);

  useEffect(() => {
    if (!questions) {
      fetchQuestions(categoryId).then(fetchedQuestions => {
        setCurrentQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setGameOver(false);
      });
    }
  }, [categoryId, questions]);

  const handleAnswerClick = (answer, isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < currentQuestions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        setShowResult(true);
      }
    } else {
      setGameOver(true);
      setCorrectAnswer(currentQuestions[currentQuestionIndex].correct_answer);
    }
  };

  const handleRestart = () => {
    fetchQuestions(categoryId).then(fetchedQuestions => {
      setCurrentQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameOver(false);
      setShowResult(false);
    });
  };

  if (gameOver) {
    // Sanitize the category name and correct answer
    const sanitizedCategoryName = DOMPurify.sanitize(safeCategoryName).toLowerCase().replace(/ /g, '-');
    const sanitizedCorrectAnswer = DOMPurify.sanitize(correctAnswer);
  
    return (
      <div className={`game-over quiz-page-${sanitizedCategoryName}`}>
        <h2>Game Over</h2>
        <p>The correct answer was: <strong>{sanitizedCorrectAnswer}</strong></p>
        <div className='go-buttons'>
        <button onClick={handleRestart}>Start Over</button>
        <button onClick={() => navigate('/categories')}>Back to Categories</button>    
        </div>
        
      </div>
    );
  }

  if (showResult) {
    return (
      <div className={`quiz-result quiz-page-${safeCategoryName.toLowerCase().replace(/ /g, '-')}`}>
        <h2>Your Score: {score}/{currentQuestions.length}</h2>
        <button onClick={() => navigate('/categories')}>Back to Categories</button>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

  // Shuffle answers to ensure correct answer is not always in the same position
  const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

  return (
    <div className={`quiz-page quiz-page-${safeCategoryName.toLowerCase().replace(/ /g, '-')}`}>
        <div className='card'>
            <h2>Question {currentQuestionIndex + 1}</h2>
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentQuestion.question) }} />
      <div className="answers">
        {shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer, answer === currentQuestion.correct_answer)}
          >
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }} />
          </button>
        ))}
        </div>
      
      </div>
    </div>
  );
}

export default QuizPage;
