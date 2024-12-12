import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [stockSymbol, setStockSymbol] = useState("GOOG");
  const [stockData, setStockData] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const fetchStockData = async () => {
    try {
      // Fetch stock data from the Flask API
      const response = await axios.get(
        `http://localhost:6000/stock-data?stockSymbol=${stockSymbol}`
      );
      setStockData(response.data);

      // Send stock data for prediction
      const predictionResponse = await axios.post(
        "http://localhost:6000/predict",
        { stockData: response.data }
      );
      setPredictions(predictionResponse.data.predictions);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleSubmit = () => {
    fetchStockData();
  };

  const renderChart = () => {
    if (stockData && predictions) {
      const dates = stockData.map((data) => data.Date);
      const actualPrices = stockData.map((data) => data.Close);
      const predictedPrices = predictions;

      return (
        <Line
          data={{
            labels: dates,
            datasets: [
              {
                label: "Actual Prices",
                data: actualPrices,
                borderColor: "green",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Predicted Prices",
                data: predictedPrices,
                borderColor: "red",
                borderWidth: 2,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Stock Price Prediction",
              },
            },
          }}
        />
      );
    }
    return <p>Loading...</p>;
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Welcome to the Home Page!</h2>
        <p>
          This is a simple homepage where you can navigate to your profile or
          log out. Below, you can enter a stock symbol to get stock price
          predictions.
        </p>

        <div style={styles.predictionSection}>
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="Enter Stock Symbol"
          />
          <button onClick={handleSubmit}>Predict</button>

          {renderChart()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "2rem",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  predictionSection: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default Home;
