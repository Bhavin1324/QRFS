/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetch } from "../../../hooks/useFetch";
import { ApiKeysEnum, NavigateToRoute } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import { TokenValidation } from "../../../Utils/Common";
import Breadcrumb, { IBreadCrumbProps } from "../../CustomElement/Breadcrumb";
import ServerAlert from "../../CustomElement/ServerAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FilterStaions from "./FilterStaions";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Police staions",
      route: `${NavigateToRoute.POLICE_STATIONS}`,
    },
  ],
};

export default function PoliceStations() {
  const role = TokenValidation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let [selectedStation, setSelectedStation] = useState<IPoliceStation>();
  const [policeStations, setPoliceStations] = useState<IPoliceStation[]>([]);

  const ReqPoliceStations = useFetch<IPoliceStation[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.POLICE_STATIONS,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqDeleteStation = useFetch<IPoliceStation>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}/`,
    "DELETE"
  );

  /* const ReqUpdateStation = useFetch<IPoliceStation>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}/`,
    "PATCH",
    selectedStation
  ); */

  async function GetInitialData() {
    try {
      const ResponseStations = await ReqPoliceStations();
      setPoliceStations(ResponseStations);
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
    }
  }
  const DeleteRec = async (id: string) => {
    Swal.fire({
      title: "Are you sure you want to delete this record?",
      text: "You won't be able to revert this change!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#115e59",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          ReqDeleteStation(id).then((result) => {
            setSelectedStation(result);
            if (result) {
              Swal.fire("Deleted!", "Record deleted successfully.", "success");
            } else {
              Swal.fire("Error!", "Unable to delete record.", "error");
            }
          });
        } catch (ex) {
          console.log("Police station delete", ex);
          Swal.fire("Error!", "Unable to delete record.", "error");
        }
      }
    });
  };
  useEffect(() => {
    GetInitialData();
  }, [selectedStation]);
  function onFilter(dataList: IPoliceStation[]) {
    if (dataList.length > 0) {
      setPoliceStations(dataList);
    } else {
      GetInitialData();
    }
  }
  /* const GenerateQR = async (id: string) => {
    console.log("selected item", selectedStation);
    try {
      await ReqUpdateStation(id)
      Swal.fire("Success!", "QR generated successfully.", "success");
    } catch (ex) {
      console.log("qr execption");
    }
  }; */

  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="stripe-card">
          <Breadcrumb paths={thisLocation.paths} />
        </div>
        <div className="my-4 flex">
          <div className="fs-2">Police stations</div>
          {role.type === "ADMIN" && (
            <Link
              to={`/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.ADD_PS}`}
              className="btn btn-teal my-2 ml-auto mr-4 self-center"
            >
              Add police station
            </Link>
          )}
        </div>
        {!isLoading && policeStations.length === 0 && (
          <ServerAlert message="Unable to reach the server" />
        )}
        <div className="stripe-card">
          <FilterStaions data={policeStations} onFilter={onFilter} />
        </div>
        {isLoading && (
          <div className="text-center mt-5">
            <div className="spinner-grow text-teal-700" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {policeStations.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Area</th>
                <th>District</th>
                <th>SubDivision</th>
                <th>QRStatus</th>
                <th colSpan={3}></th>
              </tr>
            </thead>
            <tbody>
              {policeStations.map((item: IPoliceStation) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.area?.name}</td>
                    <td>{item.district?.name}</td>
                    <td>{item.subDivision?.name}</td>
                    <td>
                      {item.qrUrl ? (
                        <button
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#qrmodal"
                          onClick={() => {
                            setSelectedStation(item);
                          }}
                        >
                          <Tooltip title="Show QR" placement="right">
                            <VisibilityIcon />
                          </Tooltip>
                        </button>
                      ) : role.type === "ADMIN" ? (
                        <>
                          {/* <button
                          className="btn btn-warning"
                          onClick={() => {
                            setSelectedStation(item);
                            GenerateQR(item.id || "");
                          }}
                        >
                          Generate QR
                        </button> */}
                          <div>No QR provided</div>
                        </>
                      ) : (
                        <div>Not any QR</div>
                      )}
                    </td>
                    <td>
                      <Link to={item.id || ""} className="btn btn-teal-oline">
                        <InfoIcon />
                      </Link>
                    </td>
                    {role.type === "ADMIN" && (
                      <>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setSelectedStation(item);
                              DeleteRec(item.id || "");
                            }}
                          >
                            <Tooltip title="Delete" placement="right">
                              <DeleteIcon />
                            </Tooltip>
                          </button>
                        </td>
                        {/* <td>
                          <Link to={item.id || ""} className="btn btn-teal">
                            Edit
                          </Link>
                        </td> */}
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div
        className="modal fade"
        id="qrmodal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {selectedStation?.name}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img src={selectedStation?.qrUrl} alt="No QR generated" />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-teal"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
