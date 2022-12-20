/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface IPiechartData {
  data: any;
}
function PieChart(props: IPiechartData) {
  return (
    <div className="w-4/6 mx-auto">
      <Pie data={props.data} />
    </div>
  );
}

export default PieChart;
