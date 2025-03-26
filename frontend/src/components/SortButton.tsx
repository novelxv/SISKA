import React, { useState } from "react";
import "../styles/SortButton.css";

interface SortButtonProps {
    items: string[];
    onSelect: (selected: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ items, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleSelect = (item: string) => {
        setSelectedItem(item);
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown">
            <button className={`sort-button ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                {selectedItem || "Sort"} ▼
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {items.map((item, index) => (
                        <button key={index} onClick={() => handleSelect(item)}>
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortButton;
