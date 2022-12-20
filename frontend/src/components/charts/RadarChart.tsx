/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface IRadarChartProps {
  data: any;
}
export default function RadarChart(props: IRadarChartProps) {
  return (
    <div className="w-4/6 mx-auto">
      <Radar data={props.data} />
    </div>
  );
}
