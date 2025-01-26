import React, { useState } from 'react';
import SearchBox from './SearchBox';
import QuestionList from './QuestionList';
import Pagination from './Pagination';
import api from './api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const handleSearch = async (searchQuery, page = 1) => {
    try {
      const response = await api.post('/search', {
        query: searchQuery,
        page,
      });

      if (response.data) {
        setResults(response.data.questions || []);
        setTotalPages(response.data.totalPages || 1);
        setError('');
      }
    } catch (err) {
      setError('Error fetching search results');
      setResults([]);
      console.error('Axios error:', err.response ? err.response.data : err.message);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      handleSearch(query, page);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Filter questions based on the selected type
  const filteredResults =
    filterType === 'ALL' ? results : results.filter((question) => question.type === filterType);

  return (
    <div className="search-page">
      <h1>Quest Search</h1>
      <SearchBox onSearch={(searchQuery) => {
        setQuery(searchQuery);
        setCurrentPage(1);
        handleSearch(searchQuery, 1);
      }}
      />

      {error && <p className="error-message">{error}</p>}

      {/* Filter Dropdown */}
      <div className="filter-dropdown">
        <label htmlFor="question-filter">Filter by Type:</label>
        <select id="question-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)} >
          <option value="ALL">All</option>
          <option value="ANAGRAM">Anagram</option>
          <option value="MCQ">MCQ</option>
          <option value="READ_ALONG">Read Along</option>
          <option value="CONTENT_ONLY">Content only</option>
        </select>
      </div>

      <QuestionList questions={filteredResults} />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default SearchPage;