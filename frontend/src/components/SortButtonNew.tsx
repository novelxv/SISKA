import React from 'react';
import "../styles/SortButtonNew.css";

interface SortButtonNewProps {
  options: string[];
  selectedOption: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const SortButtonNew: React.FC<SortButtonNewProps> = ({ options, selectedOption, onChange, placeholder }) => {
  return (
    <div className="filter-select">
      <select value={selectedOption} onChange={(e) => onChange(e.target.value)}>
        {/* Jika placeholder diberikan, tampilkan sebagai opsi pertama */}
        {placeholder && <option value="" disabled>{placeholder}</option>}

        {/* Munculkan sisa opsi dari daftar */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortButtonNew;