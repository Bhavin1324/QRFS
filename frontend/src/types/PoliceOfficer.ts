import { IPoliceStation } from "./PoliceStation";
export interface IPoliceOfficer {
  id?: string;
  name: string;
  officerEmail: string;
  officerPassword: string;
  stationId: string;
  policeStation?: IPoliceStation;
}
