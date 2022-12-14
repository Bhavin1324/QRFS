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
