import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import SelectButton from "./SellectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import { HistoricalChart } from "../config/api";
import "../styles/CoinInfo.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coin?.id) return;
    const controller = new AbortController();

    const fetchHistoricData = async () => {
      try {
        setLoading(true);
        // ✅ Normalize currency to lowercase for CoinGecko API
        const normalizedCurrency = currency.toLowerCase();
        const { data } = await axios.get(HistoricalChart(coin.id, days, normalizedCurrency), {
          signal: controller.signal,
        });
        setHistoricData(data.prices);
        setLoading(false);
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error("Error fetching historic data:", error);
        setLoading(false);
      }
    };

    fetchHistoricData();
    return () => controller.abort();
  }, [coin?.id, days, currency]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!historicData.length) return <div className="loader">No data available</div>;

  const isPriceUp = historicData[historicData.length - 1][1] >= historicData[0][1];

  return (
    <div className="coininfo-card">
      <h2 className="chart-title">{coin?.name} Price Chart</h2>

      <Line
        data={{
          labels: historicData.map((point) => {
            const date = new Date(point[0]);
            const time =
              date.getHours() > 12
                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                : `${date.getHours()}:${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocaleDateString();
          }),
          datasets: [
            {
              data: historicData.map((point) => point[1]),
              label: `Price (Past ${days} Days) in ${currency}`,
              borderColor: isPriceUp ? "#00ff66" : "#ff3333",
              backgroundColor: isPriceUp ? "rgba(0,255,102,0.1)" : "rgba(255,51,51,0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#00ffcc", font: { size: 14, weight: 600 } },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "#111",
              titleColor: "#00ffcc",
              bodyColor: "#fff",
            },
          },
          scales: {
            x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
            y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
          },
        }}
      />

      <div className="chart-buttons">
        {chartDays.map((day) => (
          <SelectButton key={day.value} selected={day.value === days} onClick={() => setDays(day.value)}>
            {day.label}
          </SelectButton>
        ))}
      </div>
    </div>
  );
};

export default CoinInfo;
