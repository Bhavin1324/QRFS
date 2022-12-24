import React from "react";
import { NavLink } from "react-router-dom";
import { NavigateToRoute } from "../../types/enums";

function ConfigNav() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <ul className="nav gap-2 mb-2">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link nav-active" : "nav-link"
                }
                to={`/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.CONFIG}/${NavigateToRoute.AREA}`}
              >
                Area
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link nav-active" : "nav-link"
                }
                to={`/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.CONFIG}/${NavigateToRoute.DIV}`}
              >
                Sub division
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link nav-active" : "nav-link"
                }
                to={`/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.CONFIG}/${NavigateToRoute.DISTRICT}`}
              >
                District
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ConfigNav;
