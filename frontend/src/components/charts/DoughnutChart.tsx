/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface IDoughnutChartData {
  data: any;
}
function DoughnutChart(props: IDoughnutChartData) {
  return (
    <div className="w-4/6 mx-auto">
      <Doughnut data={props.data} />
    </div>
  );
}

export default DoughnutChart;
