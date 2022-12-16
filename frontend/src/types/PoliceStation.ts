import { IArea } from "./Area";
import { IDistrict } from "./District";
import { ISubDivision } from "./SubdDivision";

export interface IPoliceStation {
  id?: string;
  name: string;
  districtId: string;
  subDivisionId: string;
  areaId: string;
  qrUrl?: string;
  area?: IArea;
  district?: IDistrict;
  subDivision?: ISubDivision;
}
