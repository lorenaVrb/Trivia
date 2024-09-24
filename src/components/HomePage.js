import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    navigate('/categories');
  };

  return (
    <div className="homepage">
      <h1>Welcome to the Trivia Quiz</h1>
      <button className="play-button" onClick={handlePlayButtonClick}>
        Play
      </button>
    </div>
  );
}

export default HomePage;
