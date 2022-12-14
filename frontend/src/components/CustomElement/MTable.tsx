import React from "react";
import { IArea } from "../../types/Area";
import { IDistrict } from "../../types/District";
import { IPoliceStation } from "../../types/PoliceStation";
import { ISubDivision } from "../../types/SubdDivision";

interface MTableProps {
  data?: IArea | IDistrict | IPoliceStation | ISubDivision;
}

function MTable(props: MTableProps) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Area</th>
            <th scope="col">Subdivsion</th>
            <th scope="col">District</th>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody>{}</tbody>
      </table>
    </>
  );
}

export default MTable;
