import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Cari akun..."
                value={query}
                onChange={handleChange}
            />
            <button onClick={handleSearch}>Cari</button>
        </div>
    );
};

export default SearchBar;
