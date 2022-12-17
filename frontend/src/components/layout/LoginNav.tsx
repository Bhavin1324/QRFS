import { NavLink, useParams } from "react-router-dom";
import { NavigateToRoute } from "../../types/enums";

function LoginNav() {
  const { id } = useParams();
  return (
    <ul className="nav gap-2">
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive || id ? "nav-link nav-active" : "nav-link"
          }
          to={id ? `/${NavigateToRoute.HOME}/${id}` : `${NavigateToRoute.HOME}`}
        >
          Citizen
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link nav-active" : "nav-link"
          }
          to={"/" + NavigateToRoute.OFFICER}
        >
          Officer
        </NavLink>
      </li>
    </ul>
  );
}

export default LoginNav;
