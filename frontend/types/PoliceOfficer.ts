import { IPoliceStation } from "./PoliceStation";
export interface IPoliceOfficer {
  id?: string;
  name: string;
  officerEmail: string;
  password: string;
  stationId: string;
  policeStation?: IPoliceStation;
}
