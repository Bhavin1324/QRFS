/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ILoginCredential } from "../../types/CitizenCredentials";
import { ApiKeysEnum, NavigateToRoute } from "../../types/enums";
import { IPoliceOfficer } from "../../types/PoliceOfficer";
import Breadcrumb, { IBreadCrumbProps } from "../CustomElement/Breadcrumb";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { IPoliceStation } from "../../types/PoliceStation";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Profile",
      route: `${NavigateToRoute.PROFILE}`,
    },
  ],
};
interface IActivatedUser {
  name: string;
  qrUrl: string;
  email: string;
  stationName: string;
  stationArea: string;
  stationSubDivision: string;
  stationDistrict: string;
}
const initialValue: IActivatedUser = {
  name: "",
  qrUrl: "",
  email: "",
  stationArea: "",
  stationDistrict: "",
  stationName: "",
  stationSubDivision: "",
};
export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IActivatedUser>(initialValue);
  const ReqGetCurrentUser = useFetch<ILoginCredential>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.CURRENT_USER}`,
    "POST",
    { email: localStorage.getItem("user") || "" },
    localStorage.getItem("token") || ""
  );

  async function LoadData() {
    try {
      const resultUser = await ReqGetCurrentUser();
      setProfile(resultUser);
    } catch (ex) {
      console.log("Load data exception", ex);
    }
  }
  useEffect(() => {
    LoadData();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-xs-12">
          <div className="stripe-card">
            <Breadcrumb paths={thisLocation.paths} />
          </div>
        </div>
        <div className="flex gap-4">
          <div
            className="self-center text-lg"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackOutlinedIcon className="cursor-pointer" />
          </div>
          <div className="fs-2 my-3">{profile.name}</div>
        </div>
      </div>
      <div className="flex justify-around gap-5">
        {profile.qrUrl ? (
          <div>
            <img src={profile.qrUrl} alt="" />
          </div>
        ) : (
          <div className="font-semibold">
            No Qr generated for this police station
          </div>
        )}
        <div>
          <div className="fs-3">
            <table className="table">
              <tbody>
                <tr>
                  <th>Police station</th>
                  <td>{profile.stationName}</td>
                </tr>
                <tr>
                  <th>Area</th>
                  <td>{profile.stationArea}</td>
                </tr>
                <tr>
                  <th>District</th>
                  <td>{profile.stationDistrict}</td>
                </tr>
                <tr>
                  <th>Sub division</th>
                  <td>{profile.stationSubDivision}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
