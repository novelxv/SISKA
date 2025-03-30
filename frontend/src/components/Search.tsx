import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Cari..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <span className="search-icon-wrapper">
        <FaSearch />
      </span>
    </div>
  );
};

export default Search;