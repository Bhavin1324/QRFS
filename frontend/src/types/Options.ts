import { IQuestion } from "./Questions";
export interface IOptions {
  id?: string;
  text: string;
  textGujarati?: string;
  questionId?: string;
  question?: IQuestion;
}
