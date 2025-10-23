import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";

function App() {
  return (
    <Router>
      <Header /> {/* Header should be OUTSIDE all page containers */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coins/:id" element={<CoinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
