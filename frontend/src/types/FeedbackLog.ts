import { IPoliceStation } from "./PoliceStation";

export interface IFeedbackLog {
  id?: string;
  citizenEmail: string;
  timeStamp: Date;
  isSubmitted: boolean;
  stationId: string;
  policeStation?: IPoliceStation;
}
