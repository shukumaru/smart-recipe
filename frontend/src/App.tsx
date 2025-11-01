import React from 'react';
import RecipePage from './pages/RecipePage';
import './App.css'; // グローバルなスタイルがあれば

const App: React.FC = () => {
  return (
    <div className="App">
      <RecipePage />
    </div>
  );
};

export default App;