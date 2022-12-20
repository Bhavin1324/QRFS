export type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type TokenType = "MASTER" | "CLIENT" | "ADMIN" | "";

export interface IOTP {
  otp: string;
}
export interface IUser {
  email: string;
  exp: number;
  type: TokenType;
}
export interface ILoginForm {
  email: string;
  password?: string;
  otp?: string;
  errors: {
    email?: string;
    password?: string;
    otp?: string;
    validOtp?: string;
    validPass?: string;
  };
}

export const chartBackground = [
  "#36a2eb",
  "#ff6384",
  "#4bc0c0",
  "#ff9f40",
  "#9966ff",
  "#ffcd56",
  "#68c182",
  "#267db3",
  "#8561c8",
  "#a92689",
  "#626260",
  "#c3792f",
];
