import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart(chartData: any) {
  return (
    <div className="container">
      <Bar data={chartData} />
    </div>
  );
}

export default BarChart;
