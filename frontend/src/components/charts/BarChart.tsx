/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface IBarchartData {
  data: any;
}
function BarChart(props: IBarchartData) {
  return <Bar data={props.data} />;
}

export default BarChart;
