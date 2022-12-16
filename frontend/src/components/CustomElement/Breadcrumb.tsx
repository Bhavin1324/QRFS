import React from "react";
import { Link } from "react-router-dom";

export interface IBreadCrumbProps {
  paths: { pathName: string; route: string }[];
}
function Breadcrumb(props: IBreadCrumbProps) {
  return (
    <>
      <ol className="breadcrumb mb-0">
        {props.paths.map(
          (item: { pathName: string; route: string }, index: number) => {
            return (
              <li
                key={index}
                className={
                  index < props.paths.length - 1
                    ? "breadcrumb-item active"
                    : "breadcrumb-item"
                }
              >
                {index < props.paths.length - 1 ? (
                  <Link to={item.route}>{item.pathName}</Link>
                ) : (
                  item.pathName
                )}
              </li>
            );
          }
        )}
      </ol>
    </>
  );
}

export default Breadcrumb;
