import { NavLink } from "react-router-dom";

function LoginNav() {
  return (
    <ul className="nav gap-2">
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link nav-active" : "nav-link"
          }
          to="/"
        >
          Citizen
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link nav-active" : "nav-link"
          }
          to="/officer"
        >
          Officer
        </NavLink>
      </li>
    </ul>
  );
}

export default LoginNav;
