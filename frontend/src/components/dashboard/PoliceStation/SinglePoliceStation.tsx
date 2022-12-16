import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { ApiKeysEnum, NavigateToRoute } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import Breadcrumb, { IBreadCrumbProps } from "../../CustomElement/Breadcrumb";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import UpdatePoliceStation from "./UpdatePoliceStation";
import { TokenValidation } from "../../../Utils/Common";
import Swal from "sweetalert2";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Police staions",
      route: `/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.POLICE_STATIONS}`,
    },
    {
      pathName: "Details",
      route: `${NavigateToRoute.POLICE_STATIONS}`,
    },
  ],
};
function SinglePoliceStation() {
  const role = TokenValidation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const initialStationState: IPoliceStation = {
    areaId: "",
    districtId: "",
    name: "",
    subDivisionId: "",
  };
  const [currentStation, setCurrentStation] =
    useState<IPoliceStation>(initialStationState);

  const RequestCurrentStation = useFetch<IPoliceStation>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.POLICE_STATIONS + `/${id}`,
    "GET",
    initialStationState,
    localStorage.getItem("token") || ""
  );

  const ReqDelCurrentStation = useFetch<IPoliceStation>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.POLICE_STATIONS + `/${id}`,
    "DELETE"
  );
  const DeleteRec = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this change!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#115e59",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          ReqDelCurrentStation().then((result) => result);
        } catch (ex) {
          console.log("delete execption");
        }
        Swal.fire("Deleted!", "Record deleted successfully.", "success");
        navigate(
          `/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.POLICE_STATIONS}`
        );
      }
    });
  };
  async function updateCurrentStation(newStation: IPoliceStation) {
    setCurrentStation(newStation);
  }
  async function LoadData() {
    try {
      const result = await RequestCurrentStation();
      setCurrentStation(result);
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    LoadData();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-xs-12">
          <div>
            <div className="stripe-card">
              <Breadcrumb paths={thisLocation.paths} />
            </div>
          </div>
          {!isLoading && (
            <div className="flex gap-4">
              <div
                className="self-center text-lg"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowBackOutlinedIcon className="cursor-pointer" />
              </div>
              <div className="fs-2 my-3">{currentStation.name}</div>
              {role.type === "ADMIN" && (
                <div className="self-center ml-auto">
                  <button
                    className="btn btn-teal-oline mx-2"
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-teal mx-2" onClick={DeleteRec}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="text-center mt-5">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table">
              <tbody>
                <tr>
                  <th>Id</th>
                  <td>{currentStation.id}</td>
                </tr>
                <tr>
                  <th>Area</th>
                  <td>{currentStation.area?.name}</td>
                </tr>
                <tr>
                  <th>District</th>
                  <td>{currentStation.district?.name}</td>
                </tr>
                <tr>
                  <th>Sub division</th>
                  <td>{currentStation.subDivision?.name}</td>
                </tr>
                <tr>
                  <th>QR code</th>
                  <td>
                    {currentStation.qrUrl ? (
                      <img
                        src={currentStation?.qrUrl}
                        alt="No QR generated"
                        className="my-2 h-40 w-40"
                      />
                    ) : (
                      "No QR available"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {isEdit && (
        <UpdatePoliceStation
          data={currentStation}
          onUpdate={updateCurrentStation}
        />
      )}
    </>
  );
}

export default SinglePoliceStation;
