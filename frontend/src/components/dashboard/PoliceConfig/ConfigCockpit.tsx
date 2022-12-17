/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { IArea } from "../../../types/Area";
import { IDistrict } from "../../../types/District";
import { ApiKeysEnum } from "../../../types/enums";
import { ISubDivision } from "../../../types/SubdDivision";
import MTable from "./MTable";

export default function ConfigCockpit(props: {
  type: "AREA" | "DIV" | "DISTRICT";
}) {
  const [area, setArea] = useState<IArea[]>([]);
  const [subDivision, setSubDivision] = useState<ISubDivision[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);

  const ReqArea = useFetch<IArea[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.AREAS,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqSubDivision = useFetch<ISubDivision[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.SUB_DIVISION,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqDistrict = useFetch<IDistrict[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.DISTRICTS,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );

  async function GetInitialData() {
    try {
      const lstArea = await ReqArea();
      setArea(lstArea);
      const lstSubDiv = await ReqSubDivision();
      setSubDivision(lstSubDiv);
      const lstDistrict = await ReqDistrict();
      setDistrict(lstDistrict);
    } catch (ex) {
      console.log("Cockpit get data exception:", ex);
    }
  }
  function onAreaEffect(newArea: IArea, isDelete: boolean) {
    if (isDelete) {
      GetInitialData();
    } else {
      setArea([...area, newArea]);
    }
  }
  function onDistrictEffect(newDistrict: IArea, isDelete: boolean) {
    if (isDelete) {
      GetInitialData();
    } else {
      setDistrict([...district, newDistrict]);
    }
  }
  function onSubDivEffect(newDiv: IArea, isDelete: boolean) {
    if (isDelete) {
      GetInitialData();
    } else {
      setSubDivision([...subDivision, newDiv]);
    }
  }
  function onAreaFilter(dataList: IArea[]) {
    if (dataList.length > 0) {
      setArea(dataList);
    } else {
      GetInitialData();
    }
  }
  function onDivFilter(dataList: IArea[]) {
    if (dataList.length > 0) {
      setSubDivision(dataList);
    } else {
      GetInitialData();
    }
  }
  function onDistrictFilter(dataList: IArea[]) {
    if (dataList.length > 0) {
      setDistrict(dataList);
    } else {
      GetInitialData();
    }
  }
  useEffect(() => {
    GetInitialData();
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          {props.type === "AREA" && (
            <MTable
              data={area}
              onEffect={onAreaEffect}
              onFilter={onAreaFilter}
            />
          )}
        </div>
        <div className="col-xs-12">
          {props.type === "DIV" && (
            <MTable
              data={subDivision}
              onEffect={onSubDivEffect}
              onFilter={onDivFilter}
            />
          )}
        </div>
        <div className="col-xs-12">
          {props.type === "DISTRICT" && (
            <MTable
              data={district}
              onEffect={onDistrictEffect}
              onFilter={onDistrictFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
