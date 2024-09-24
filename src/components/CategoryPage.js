// In your CategoryPage component

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../api';

function CategoryPage() {
  const navigate = useNavigate();
  const categories = [
    { id: 9, name: 'General Knowledge'},
    { id: 20, name: 'Mythology'},
    { id: 25, name: 'Art'},
    { id: 12, name: 'Music'},
    { id: 28, name: 'Vehicles'},
    { id: 17, name: 'Science' },
    { id: 23, name: 'History' },
    { id: 22, name: 'Geography'},
    { id: 21, name: 'Sports' },
  ];

  // Ensure you're passing categoryName along with questions and categoryId
const handleCategorySelect = async (category) => {
  const questions = await fetchQuestions(category.id);
  navigate('/quiz', { state: { questions, categoryId: category.id, categoryName: category.name } });
};


  return (
    <div className="category-page">
      <div className='card'>
        <h2>Select a Category</h2>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-button"
            onClick={() => handleCategorySelect(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      </div>
    </div>
  );
}

export default CategoryPage;
