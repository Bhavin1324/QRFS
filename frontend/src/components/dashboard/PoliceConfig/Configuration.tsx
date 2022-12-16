import React from "react";
import { NavigateToRoute } from "../../../types/enums";
import { IBreadCrumbProps } from "../../CustomElement/Breadcrumb";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Police staions",
      route: `${NavigateToRoute.POLICE_STATIONS}`,
    },
  ],
};
export default function Configuration() {
  return <div className="row"></div>;
}
