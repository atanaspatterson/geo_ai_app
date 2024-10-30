import './App.css';
import React from 'react';
import SearchForm from './searchForm/SearchForm';

function App() {
  const handleSearch = (query) => {
    console.log("User searched for:", query);
    // Add logic to handle the search query
  };

  return (
    <div className="App">
      <SearchForm onSearch={handleSearch} placeholder="Type your query..." />
    </div>
  );
}

export default App;
