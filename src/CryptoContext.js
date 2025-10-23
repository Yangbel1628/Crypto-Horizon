import React, { createContext, useContext, useState } from "react";

const Crypto = createContext();

export const CryptoProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  React.useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else setSymbol("$");
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </Crypto.Provider>
  );
};

export const CryptoState = () => useContext(Crypto);
