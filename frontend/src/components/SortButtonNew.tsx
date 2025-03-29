import React from 'react';
import "../styles/SortButtonNew.css";

interface SortButtonNewProps {
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const SortButtonNew: React.FC<SortButtonNewProps> = ({ options, selectedOption, onChange }) => {
  return (
    <div className="filter-select">
      <select value={selectedOption} onChange={(e) => onChange(e.target.value)}>
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
