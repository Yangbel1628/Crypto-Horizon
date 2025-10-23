import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "../components/CoinsTable";
import "../styles/CoinPage.css";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [error, setError] = useState(null);
  const { currency, symbol } = CryptoState();

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    // ✅ Fetch coin with retry logic for mobile/network issues
    const fetchCoin = async (retry = 3) => {
      try {
        const { data } = await axios.get(SingleCoin(id), { signal: controller.signal });
        if (!data) {
          setError("Coin data not found.");
        } else {
          setCoin(data);
          setError(null); // Clear previous errors if successful
        }
      } catch (err) {
        if (err.name === "CanceledError") return; // Ignore aborted fetch
        if (retry > 0) {
          // Retry after 1 second
          setTimeout(() => fetchCoin(retry - 1), 1000);
        } else {
          console.error("Error fetching coin:", err);
          setError("Failed to fetch coin. Check your internet.");
        }
      }
    };

    fetchCoin();
    return () => controller.abort();
  }, [id]);

  // ✅ Render loading / error messages with optional retry button
  if (error)
    return (
      <div className="loader">
        {error} <button onClick={() => setCoin(null) || setError(null)}>Retry</button>
      </div>
    );
  if (!coin) return <div className="loader">Loading...</div>;

  return (
    <div className="coinpage-container">
      <div className="sidebar">
        <img src={coin?.image.large} alt={coin?.name} className="coin-image" />
        <h2>{coin?.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin?.description?.en?.split(". ")[0] + "." }} />
        <div className="market-data">
          <p>Rank: {numberWithCommas(coin?.market_cap_rank)}</p>
          <p>
            Current Price: {symbol}{" "}
            {numberWithCommas(coin?.market_data?.current_price[currency.toLowerCase()])}
          </p>
          <p>
            Market Cap: {symbol}{" "}
            {numberWithCommas(
              coin?.market_data?.market_cap[currency.toLowerCase()].toString().slice(0, -6)
            )}
            M
          </p>
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
