import React from 'react';
import './SearchForm.css';

function SearchForm({ placeholder = "Search...", onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.searchInput.value;
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="search-container">
      {"GEO AI SEARCH ENGINE"}
      <h1 className="logo-text">GEO AI</h1>
      
      {/* Search Form */}
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          name="searchInput"
          type="text"
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default SearchForm;