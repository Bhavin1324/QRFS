import { IFeedbackLog } from "./FeedbackLog";
import { IOptions } from "./Options";
import { IPoliceStation } from "./PoliceStation";
import { IQuestion } from "./Questions";

interface Iformtype {
  questionId: string;
  optionId: string;
}

export interface ICitizenResponse {
  id?: string;
  questionId: string;
  optionId: string;
  stationId: string;
  responseDate?: string;
  logId?: string;
  feedbackLog?: IFeedbackLog;
  options?: IOptions;
  question?: IQuestion;
  policeStation?: IPoliceStation;
}
