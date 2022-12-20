import React, { useState } from "react";
import BarChart from "../../charts/BarChart";
import DoughnutChart from "../../charts/DoughnutChart";
import LineChart from "../../charts/LineChart";
import PieChart from "../../charts/PieChart";
import RadarChart from "../../charts/RadarChart";

type ChartType = "BAR" | "PIE" | "LINE" | "DOUGHNUT" | "RADAR";
interface IChartSelectorProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: any;
      backgroundColor: string[];
      borderColor?: string;
      borderRadiud?: number;
      borderSkipped?: boolean;
    }[];
  };
}
interface IChatInfo {
  type: ChartType;
  label: string;
}
const chartDetails: IChatInfo[] = [
  { type: "BAR", label: "Bar" },
  { type: "PIE", label: "Pie" },
  { type: "DOUGHNUT", label: "Doughnut" },
  { type: "LINE", label: "Line" },
  { type: "RADAR", label: "Radar" },
];

export default function ChartSelector(props: IChartSelectorProps) {
  const [selectorValue, setSelectorValue] = useState<IChatInfo>({
    label: "Bar",
    type: "BAR",
  });

  function changeHandler(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setSelectorValue({
      ...selectorValue,
      [name]: value,
      label: value.toLowerCase(),
    });
  }
  return (
    <>
      <div className="row">
        <div className="col-md-9"></div>

        <div className="col-md-3">
          <div className="form-floating mb-3">
            <select
              className="form-control mb-1"
              name="type"
              aria-label="label"
              value={selectorValue.type}
              onChange={changeHandler}
            >
              {chartDetails.map((item: IChatInfo) => {
                return (
                  <option key={item.type} value={item.type}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <label>Select chart type</label>
          </div>
        </div>
      </div>
      {selectorValue.type === "BAR" && <BarChart data={props.data} />}
      {selectorValue.type === "LINE" && <LineChart data={props.data} />}
      {selectorValue.type === "DOUGHNUT" && <DoughnutChart data={props.data} />}
      {selectorValue.type === "PIE" && <PieChart data={props.data} />}
      {selectorValue.type === "RADAR" && <RadarChart data={props.data} />}
    </>
  );
}
