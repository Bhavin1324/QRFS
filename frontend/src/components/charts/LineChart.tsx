/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface ILineChartData {
  data: any;
}
function LineChart(props: ILineChartData) {
  return <Line data={props.data} />;
}

export default LineChart;
