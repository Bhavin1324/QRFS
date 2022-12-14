import React, { useState } from "react";
import { IArea } from "../../../types/Area";
import { IDistrict } from "../../../types/District";
import { IPoliceStation } from "../../../types/PoliceStation";
import { ISubDivision } from "../../../types/SubdDivision";
import MTable from "../../CustomElement/MTable";

function PoliceStations() {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [policeStations, setPoliceStations] = useState<
    IPoliceStation | IPoliceStation[]
  >([]);
  const [area, setArea] = useState<IArea | IArea[]>([]);
  const [subDivision, setSubDivision] = useState<ISubDivision | ISubDivision[]>(
    []
  );
  const [disctrict, setDistrict] = useState<IDistrict | IDistrict[]>([]);

  async function GetPoliceStations() {}
  async function GetAreas() {}
  async function GetSubDivisions() {}
  async function GetDistrict() {}
  /* Call an apis using useFetch and also pass List to MTable component for the iterating the data */
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="fs-2 mb-4">Police stations</div>
        <MTable />
      </div>
    </div>
  );
}

export default PoliceStations;
