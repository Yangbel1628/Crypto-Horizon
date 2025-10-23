// src/config/api.js
import axios from "axios";

// API endpoints
export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

// Helper functions for fetching data with error handling
export const fetchCoinsList = async (currency) => {
  try {
    const { data } = await axios.get(CoinList(currency));
    return data;
  } catch (error) {
    console.error("Error fetching CoinList:", error.message);
    return [];
  }
};

export const fetchSingleCoin = async (id) => {
  try {
    const { data } = await axios.get(SingleCoin(id));
    return data;
  } catch (error) {
    console.error("Error fetching SingleCoin:", error.message);
    return null;
  }
};

export const fetchHistoricalChart = async (id, days, currency) => {
  try {
    const { data } = await axios.get(HistoricalChart(id, days, currency));
    return data.prices || [];
  } catch (error) {
    console.error("Error fetching HistoricalChart:", error.message);
    return [];
  }
};

export const fetchTrendingCoins = async (currency) => {
  try {
    const { data } = await axios.get(TrendingCoins(currency));
    return data;
  } catch (error) {
    console.error("Error fetching TrendingCoins:", error.message);
    return [];
  }
};
