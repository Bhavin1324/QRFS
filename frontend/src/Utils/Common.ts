import { IUser, TokenType } from "../types/Common";
import jwt_decode from "jwt-decode";

export function isTokenExpired(miliseconds: number): boolean {
  if (miliseconds > new Date().getTime()) {
    return false;
  } else {
    return true;
  }
}

export const TokenValidation = (): { type: TokenType; isExp: boolean } => {
  const token = localStorage.getItem("token");
  let decode: IUser = { email: "", exp: 0, type: "" };
  if (token) {
    try {
      decode = jwt_decode(token);
      return { isExp: isTokenExpired(decode.exp), type: decode.type };
    } catch (ex) {
      decode = { email: "", exp: 0, type: "" };
      return { isExp: isTokenExpired(decode.exp), type: decode.type };
    }
  }
  return { isExp: isTokenExpired(decode.exp), type: decode.type };
};

export function convertToDashedDate(date: string): string {
  const arr = date.split("/");
  return `${arr[2]}-${arr[0]}-${arr[1]}`;
}

export function GetPreviousYearsList(): number[] {
  const year = new Date().getFullYear();
  return Array.from(new Array(20), (value, index) => year - index);
}
