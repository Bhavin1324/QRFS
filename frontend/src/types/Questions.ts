import { ICitizenResponse } from "./CitizenResponse";
import { IOptions } from "./Options";

export interface IQuestion {
  id?: string;
  text: string;
  textGujarati?: string;
  isDescriptive?: boolean;
  citizenResponses?: ICitizenResponse[];
  options?: IOptions[];
}
