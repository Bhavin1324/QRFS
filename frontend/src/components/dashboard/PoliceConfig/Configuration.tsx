import React from "react";
import { Outlet } from "react-router-dom";
import { NavigateToRoute } from "../../../types/enums";
import Breadcrumb, { IBreadCrumbProps } from "../../CustomElement/Breadcrumb";
import ConfigNav from "../../layout/ConfigNav";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Configurations",
      route: `${NavigateToRoute.CONFIG}`,
    },
  ],
};
export default function Configuration() {
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="stripe-card">
          <Breadcrumb paths={thisLocation.paths} />
        </div>
      </div>
      <div className="col-xs-12 mt-3">
        <ConfigNav />
        <Outlet />
      </div>
    </div>
  );
}
