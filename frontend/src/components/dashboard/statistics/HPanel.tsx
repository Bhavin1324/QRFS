/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { chartBackground } from "../../../types/Common";
import { ApiKeysEnum } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import { ICRPerMonth, IPoliceStationRating } from "../../../types/Statistics";
import ServerAlert from "../../CustomElement/ServerAlert";
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
  const [loading, setLoading] = useState(true);
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
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqTotalFeedbackPsWise = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.STATISTICS}/`,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqGetPoliceStation = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}`,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqGetPsRating = useFetch(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.RATING}/`,
    "GET",
    [],
    localStorage.getItem("token") || ""
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

  async function GetInitialData() {
    try {
      const lstPoliceStation = await ReqGetPoliceStation();
      setPoliceStations(lstPoliceStation);
      const totalFb = await ReqTotalFeedback();
      setTotalFeedback(totalFb);
      if (totalFb && lstPoliceStation) {
        setLoading(false);
      }
    } catch (ex) {
      setLoading(false);
      console.log("Exception in getting initial data:" + ex);
    }
  }
  useEffect(() => {
    GetInitialData();
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
      <div className="mx-auto w-3/4 text-center">
        {loading ? (
          <div className="spinner-grow text-teal-700 mt-2" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : totalFeedbback.length > 0 ? (
          <ChartSelector
            data={GetGlobalGraphData(
              !formValue.stationId ? totalFeedbback : stationWiseResponse
            )}
          />
        ) : (
          <ServerAlert message="Unable to get data from server" />
        )}
      </div>
    </div>
  );
}
