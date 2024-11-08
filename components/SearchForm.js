import React from 'react';
import styles from '../styles/SearchForm.module.css'; // Import as `styles`

function SearchForm({ placeholder = "Search...", onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.searchInput.value;
    if (onSearch) {
      onSearch(query);
    }
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
        />
        <button type="submit" className={styles['search-button']}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="24px"
          height="24px"
        >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M12 4l1.41 1.41L6.83 12H20v2H6.83l6.58 6.59L12 20l-8-8 8-8z" />
    </svg>
        </button>
      </form>

    </div>
  );
}

export default SearchForm;