import React from "react";
import { FaPlus } from "react-icons/fa";
import "../styles/Button.css"

interface ButtonWithIconProps {
    text: string;
    onClick: () => void;
    className?: string;
    hideIcon?: boolean;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ text, onClick, className = "", hideIcon = false }) => {
    return (
        <button className={`add-btn ${className}`} onClick={onClick}>
            {!hideIcon && (
                <span className="icon-wrapper">
                    <FaPlus />
                </span>
            )}
            <span>{text}</span>
        </button>
    );
};

export default ButtonWithIcon;
