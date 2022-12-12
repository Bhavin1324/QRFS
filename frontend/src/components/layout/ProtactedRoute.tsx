import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { isTokenExpired } from "../../Utils/Common";

interface ICitizenUser {
  email: string;
  exp: number;
}

const TokenValidation = (): boolean => {
  const token = localStorage.getItem("token");
  let decode: ICitizenUser = { email: "", exp: 0 };
  if (token) {
    try {
      decode = jwt_decode(token);
      return isTokenExpired(decode.exp);
    } catch (ex) {
      decode = { email: "", exp: 0 };
      return isTokenExpired(decode.exp);
    }
  }
  return isTokenExpired(decode.exp);
};

function ProtactedRoute() {
  return (
    <div className="container mt-4">
      {TokenValidation() ? <Outlet /> : <Navigate to="/" />}
    </div>
  );
}

export default ProtactedRoute;
