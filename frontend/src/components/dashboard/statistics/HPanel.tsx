/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { chartBackground } from "../../../types/Common";
import { ApiKeysEnum } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import { ICRPerMonth, IPoliceStationRating } from "../../../types/Statistics";
import ChartSelector from "./ChartSelector";

function GetGlobalGraphData(data: ICRPerMonth[]) {
  data = data.sort((a, b) =>
    a.monthNumber > b.monthNumber ? 1 : b.monthNumber > a.monthNumber ? -1 : 0
  );
  return {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Total feedbacks per month",
        data: data.map((item) => item.qCount),
        backgroundColor: chartBackground,
        borderColor: "teal",
        borderRadius: 10,
        // borderSkipped: false,
      },
    ],
  };
}

export default function HPanel() {
  const [selectedPS, setSelectedPS] = useState<IPoliceStationRating>({
    rating: 0,
    stationId: "",
  });
  const [formValue, setFormValue] = useState<{ stationId: string }>({
    stationId: "",
  });
  const [policeStations, setPoliceStations] = useState<IPoliceStation[]>([]);
  const [totalFeedbback, setTotalFeedback] = useState<ICRPerMonth[]>([]);
  const [stationWiseResponse, setStationWiseResponse] = useState<ICRPerMonth[]>(
    []
  );
  const ReqTotalFeedback = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.STATISTICS}`,
    "GET"
  );
  const ReqTotalFeedbackPsWise = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.STATISTICS}/`,
    "GET"
  );
  const ReqGetPoliceStation = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}`,
    "GET"
  );
  const ReqGetPsRating = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.RATING}/`,
    "GET"
  );

  function changeHandler(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
    ReqTotalFeedbackPsWise(value)
      .then((result) => setStationWiseResponse(result))
      .catch((ex) => console.log("Change handler excetion feedback", ex));
    ReqGetPsRating(value)
      .then((result) => setSelectedPS(result))
      .catch((ex) => console.log("Change handler excetion rating", ex));
  }

  useEffect(() => {
    ReqGetPoliceStation()
      .then((result) => setPoliceStations(result))
      .catch((ex) => console.log("Exception in fetching police station", ex));
    ReqTotalFeedback()
      .then((result) => {
        setTotalFeedback(result);
      })
      .catch((ex) => console.log("Exception in cathing response", ex));
  }, []);

  return (
    <div>
      <div className="fs-2 mx-2 my-3">Feedback statistics</div>
      <div className="stripe-card">
        <div className="row">
          <div className="col-md-4">
            <div className="form-floating">
              <select
                className="form-control mb-1"
                name="stationId"
                onChange={changeHandler}
              >
                <option value="">Select police station</option>
                {policeStations.map((item: IPoliceStation) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select chart type</label>
            </div>
          </div>
          <div className="col-md-4"></div>
          {selectedPS.rating > 0 && (
            <div className="col-md-4 flex">
              <div className="self-center fs-5 mr-3">
                Average rating of this police station is
              </div>
              <div className="self-center">
                <span className="fs-2 p-4 bg-teal-700 text-white rounded-full">
                  {selectedPS.rating}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto w-3/4">
        <ChartSelector
          data={GetGlobalGraphData(
            !formValue.stationId ? totalFeedbback : stationWiseResponse
          )}
        />
      </div>
    </div>
  );
}
