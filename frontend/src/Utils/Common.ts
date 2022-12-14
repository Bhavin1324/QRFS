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
