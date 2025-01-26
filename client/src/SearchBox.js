import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (value) => {
    setInput(value);
    onSearch(value.trim());
  };

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  return (
    <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
      <div className="d-flex align-items-center">
        <div className="input-wrapper">
          <FaSearch className="search-icon" /> 
          <input type="text" className="form-control" placeholder="Search for questions..." value={input} onChange={(e) => handleInputChange(e.target.value)} />
          {input && (
            <button type="button" className="btn btn-clear ms-2" onClick={handleClear}> Clear </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBox;