export interface ILoginCredential {
  email: string;
  password?: string;
  loginSuccess?: boolean;
  token?: string;
  otp?: string;
}
