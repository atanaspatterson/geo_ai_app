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
    
    <div className="bottom-row">
    {/* Date Range Input */}
    <div className="date-range">
      <label for="startDate">Start Date</label>
      <input
        type="date"
        id="startDate"
        name="startDate"
        className="date-input"
      />
      <label for="endDate">End Date</label>
      <input
        type="date"
        id="endDate"
        name="endDate"
        className="date-input"
      />
    </div>

    {/* Location Input */}
    <input
      name="location"
      type="text"
      placeholder="Enter Location"
      className="location-input"
    />

    {/* Output Format Selector */}
    <div className="output-format">
      <label for="outputFormat">Output Format</label>
      <select name="outputFormat" id="outputFormat" className="format-select">
        <option value="PDF">.PDF</option>
        <option value="TID">.TID</option>
      </select>
    </div>
    </div>
    <button type="submit" className="search-button">Search</button>
  </form>
</div>
  );
}

export default SearchForm;