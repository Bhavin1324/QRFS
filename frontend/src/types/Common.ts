export type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface IOTP {
  otp: string;
}
export interface ILoginForm {
  email: string;
  password?: string;
  otp: string;
  errors: {
    email?: string;
    password?: string;
    otp?: string;
    validOtp?: string;
  };
}
