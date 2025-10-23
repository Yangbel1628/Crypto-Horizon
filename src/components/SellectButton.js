import React from "react";
import "../styles/SellectButton.css";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <button
      className={`select-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SelectButton;
