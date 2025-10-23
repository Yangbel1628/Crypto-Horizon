import React, { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import "../styles/CoinsTable.css";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError("Failed to fetch coins. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () =>
    coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(handleSearch().length / 10);

  return (
    <div className="coins-container">
      <h2 className="coins-title">Cryptocurrency Market Overview</h2>

      <input
        type="text"
        placeholder="Search Cryptocurrency..."
        className="coins-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <table className="coins-table">
            <thead>
              <tr>
                {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                  <th key={head} className={head === "Coin" ? "" : "right"}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handleSearch()
                .slice((page - 1) * 10, page * 10)
                .map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <tr
                      key={row.id}
                      className="table-row"
                      onClick={() => navigate(`/coins/${row.id}`)}
                    >
                      <td className="coin-cell">
                        <img
                          src={row?.image}
                          alt={row.name}
                          height="40"
                          style={{ marginRight: 12 }}
                        />
                        <div className="coin-info">
                          <span className="coin-symbol">{row.symbol.toUpperCase()}</span>
                          <span className="coin-name">{row.name}</span>
                        </div>
                      </td>
                      <td className="right">
                        {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                      </td>
                      <td
                        className={`right price-change ${profit ? "profit" : "loss"}`}
                      >
                        {profit && "+"}
                        {row.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="right">
                        {symbol}{" "}
                        {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => {
              setPage(i + 1);
              window.scroll(0, 400);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoinsTable;
