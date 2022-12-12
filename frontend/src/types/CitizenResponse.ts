import { IFeedbackLog } from "./FeedbackLog";
import { IOptions } from "./Options";
import { IPoliceStation } from "./PoliceStation";
import { IQuestion } from "./Questions";

export interface ICitizenResponse {
  id?: string;
  questionId: string;
  optionsId: string;
  logId?: string;
  stationId: string;
  feedbackLog?: IFeedbackLog;
  options?: IOptions;
  question?: IQuestion;
  policeStation?: IPoliceStation;
}
