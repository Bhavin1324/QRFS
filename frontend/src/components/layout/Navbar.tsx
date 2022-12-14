import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavigateToRoute } from "../../types/enums";
import { TokenValidation } from "../../Utils/Common";

function Navbar() {
  const navList = useRef<HTMLUListElement>(null);
  const HamBurger = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const role = TokenValidation();
  const checkSize = () => {
    if (window.innerWidth >= 768) {
      navList.current?.classList.add("nav-list");
      navList.current?.classList.remove("nav-mobile-list");
    } else {
      navList.current?.classList.add("nav-mobile-list");
      navList.current?.classList.remove("nav-list");
    }
  };
  const toggleHam = () => {
    HamBurger.current?.classList.toggle("ham-active");
    if (navList.current?.classList.contains("nav-mobile-list")) {
      navList.current?.classList.toggle("left-full");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(NavigateToRoute.HOME);
  };

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);
  return (
    <nav className="navbar">
      <div className="branding">
        <div className="branding-text">QRF Panel</div>
      </div>
      <ul
        className={
          window.innerWidth >= 768
            ? "nav-list left-full"
            : "nav-mobile-list left-full"
        }
        ref={navList}
      >
        <li className="nav-list-items">
          <Link
            className="link-a"
            to={`/${NavigateToRoute.DASHBOARD}`}
            onClick={toggleHam}
          >
            Home
          </Link>
        </li>
        <li className="nav-list-items">
          <Link
            className="link-a"
            to={NavigateToRoute.POLICE_STATIONS}
            onClick={toggleHam}
          >
            Police stations
          </Link>
        </li>
        {role.type === "ADMIN" && (
          <>
            <li className="nav-list-items">
              <Link
                className="link-a"
                to={`${NavigateToRoute.CONFIG}/${NavigateToRoute.AREA}`}
                onClick={toggleHam}
              >
                Configuration
              </Link>
            </li>
          </>
        )}
        {role.type === "MASTER" && (
          <>
            <li className="nav-list-items">
              <Link
                className="link-a"
                to={`${NavigateToRoute.PROFILE}`}
                onClick={toggleHam}
              >
                Profile
              </Link>
            </li>
          </>
        )}
        <li className="md:hidden">
          <button className="btn btn-light my-3" onClick={logOut}>
            Logout
          </button>
        </li>
      </ul>
      <div className="hidden md:flex">
        {/* Hardcoded for now */}
        <div className="self-center mx-2 font-semibold">
          {localStorage.getItem("user")}
        </div>
        <button className="btn btn-outline-light" onClick={logOut}>
          Logout
        </button>
      </div>
      <div ref={HamBurger} className="hamburger" onClick={toggleHam}>
        <hr className="slice" />
        <hr className="slice" />
        <hr className="slice" />
      </div>
    </nav>
  );
}

export default Navbar;
