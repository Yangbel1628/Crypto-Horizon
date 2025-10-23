import React from "react";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import "../styles/Header.css";

const Header = () => {
  const { currency, setCurrency } = CryptoState();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title" onClick={() => navigate("/")}>
          Crypto Hunter
        </h1>
        <div className="header-right">
          <select
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
