import { Navigate, Outlet } from "react-router-dom";
import { TokenType } from "../../types/Common";
import { NavigateToRoute } from "../../types/enums";
import { TokenValidation } from "../../Utils/Common";

function ProtactedRoute() {
  const tokenValid: { type: TokenType; isExp: boolean } = TokenValidation();
  return (
    <>
      {!tokenValid.isExp ? (
        <Outlet />
      ) : tokenValid.type === "MASTER" || tokenValid.type === "ADMIN" ? (
        <Navigate to={NavigateToRoute.HOME + NavigateToRoute.OFFICER} />
      ) : (
        <Navigate to={NavigateToRoute.HOME} />
      )}
    </>
  );
}

export default ProtactedRoute;
