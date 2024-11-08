import React from 'react';
import styles from '../styles/SearchForm.module.css'; // Import as `styles`
import { useState } from 'react';

function SearchForm({ placeholder = "OOO", onSearch }) {
  const [activeMode, setActiveMode] = useState('insert'); 
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.searchInput.value;
    if (onSearch) {
      onSearch(query);
    }
  };

  const toggleMode = (mode) => {
    setActiveMode(mode);
  };

  return (
    <div className={styles['search-container']}>
      <h1 className={styles['logo-text']}>GEO AI</h1>
      <form className={styles.searchform} onSubmit={handleSubmit}>
        <input
          name="searchInput"
          type="text"
          placeholder={placeholder}
          className={styles['search-input']}
          autoComplete="off"
        />{activeMode === 'insert' && (
          <input
            type="file"
            className={styles['file-input']}
            accept="image/*"
            aria-label="Insert Image"
          />
        )}
        
        <button type="submit" className={styles['search-button']}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="24px"
            height="24px"
            className={styles['arrow-icon']}
          >
          <circle cx="12" cy="12" r="11" stroke="white" stroke-width="2" fill="none"/>
          <path d="M12 16l4-4h-3V8h-2v4H8l4 4z" />
          </svg>
        </button>
      </form>
      {/* Mode Selectors */}
      <div className={styles['mode-selectors']}>
          <button
            type="button"
            className={`${styles['mode-button']} ${activeMode === 'insert' ? styles['active-mode'] : ''}`}
            onClick={() => toggleMode('insert')}
          >
            Insert Image
          </button>
          <button
            type="button"
            className={`${styles['mode-button']} ${activeMode === 'query' ? styles['active-mode'] : ''}`}
            onClick={() => toggleMode('query')}
          >
            Query LLM
          </button>
        </div>

    </div>
  );
}

export default SearchForm;