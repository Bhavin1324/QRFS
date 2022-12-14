import { IArea } from "./Area";
import { IDistrict } from "./District";
import { ISubDivision } from "./SubdDivision";

export interface IPoliceStation {
  id?: string;
  districtId: string;
  subDivisionId: string;
  areaId: string;
  area?: IArea[];
  district?: IDistrict[];
  subDivision?: ISubDivision[];
}
