import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { NavigateToRoute } from "../../types/enums";
import { TokenValidation } from "../../Utils/Common";
import Navbar from "../layout/Navbar";

function Dashboard() {
  const tokenValid = TokenValidation();
  console.log(tokenValid);
  return (
    <>
      {(tokenValid.type === "CLIENT" || tokenValid.type === "") && (
        <Navigate to={NavigateToRoute.HOME} />
      )}
      {!tokenValid.isExp ? (
        <div>
          <Navbar />
          <div className="container mt-3 px-3">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to={NavigateToRoute.HOME + NavigateToRoute.OFFICER} />
      )}
    </>
  );
}

export default Dashboard;
