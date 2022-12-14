import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { NavigateToRoute } from "../../types/enums";
import { TokenValidation } from "../../Utils/Common";
import Navbar from "../layout/Navbar";

function Dashboard() {
  const tokenValid = TokenValidation();
  return (
    <>
      {(tokenValid.type === "CLIENT" || tokenValid.type === "") && (
        <Navigate to={NavigateToRoute.HOME} />
      )}
      <div>
        <Navbar />
        <div className="container mt-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
