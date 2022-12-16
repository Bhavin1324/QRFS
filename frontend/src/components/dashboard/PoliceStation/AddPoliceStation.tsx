import React, { useEffect, useState } from "react";
import { ApiKeysEnum, NavigateToRoute } from "../../../types/enums";
import Breadcrumb, { IBreadCrumbProps } from "../../CustomElement/Breadcrumb";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { IArea } from "../../../types/Area";
import { ISubDivision } from "../../../types/SubdDivision";
import { IDistrict } from "../../../types/District";
import { IPoliceStation } from "../../../types/PoliceStation";
import Swal from "sweetalert2";

const thisLocation: IBreadCrumbProps = {
  paths: [
    { pathName: "Dashboard", route: `/${NavigateToRoute.DASHBOARD}` },
    {
      pathName: "Police staions",
      route: `/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.POLICE_STATIONS}`,
    },
    {
      pathName: "Add police station",
      route: `/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.ADD_PS}`,
    },
  ],
};
export default function AddPoliceStation() {
  const [formValues, setFormValues] = useState<IPoliceStation>({
    name: "",
    areaId: "",
    districtId: "",
    subDivisionId: "",
    qrUrl: "",
  });
  const [qrCheck, setQrCheck] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string;
    area?: string;
    div?: string;
    dist?: string;
  }>({});
  const [area, setArea] = useState<IArea[]>([]);
  const [subDivision, setSubDivision] = useState<ISubDivision[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);
  const navigate = useNavigate();

  const InsertReq = useFetch<IPoliceStation>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}`,
    "POST",
    formValues
  );
  const ReqArea = useFetch<IArea[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.AREAS,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqSubDivision = useFetch<ISubDivision[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.SUB_DIVISION,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );
  const ReqDistrict = useFetch<IDistrict[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.DISTRICTS,
    "GET",
    [],
    localStorage.getItem("token") || ""
  );

  const changeHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const Validate = (values: IPoliceStation) => {
    const err: { name?: string; area?: string; div?: string; dist?: string } =
      {};
    if (!values.name) {
      err.name = "Please enter police station name";
    }
    if (!values.areaId) {
      err.area = "Area is required";
    }
    if (!values.subDivisionId) {
      err.div = "Subdivision is required";
    }
    if (!values.districtId) {
      err.dist = "district is required";
    }
    return err;
  };

  const GetInitialData = async () => {
    try {
      const areaData: IArea[] = await ReqArea();
      const subDivData: ISubDivision[] = await ReqSubDivision();
      const districtData: IDistrict[] = await ReqDistrict();
      setArea(areaData);
      setDistrict(districtData);
      setSubDivision(subDivData);
    } catch (ex) {
      console.error("GetInitialData Exeption:", ex);
    }
  };
  useEffect(() => {
    GetInitialData();
  }, []);
  useEffect(() => {}, [errors]);

  const InsertRecord = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const er = Validate(formValues);
    setErrors(er);
    try {
      if (Object.keys(er).length === 0) {
        if (qrCheck) {
          formValues.qrUrl = `${process.env.REACT_APP_QR_URL}localhost:3000/${formValues.id}`;
        }
        const result = await InsertReq();
        if (result) {
          Swal.fire({
            icon: "success",
            title: "Recored has been inserted",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(
            `/${NavigateToRoute.DASHBOARD}/${NavigateToRoute.POLICE_STATIONS}`
          );
        }
      }
    } catch (ex) {
      console.log("Insertion error ", ex);
    }
  };
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
          <div className="fs-2 my-3">Add police station</div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <form>
            <div className="form-group">
              <label htmlFor="pname" className="mb-1">
                Enter police station name
              </label>
              <input
                type="text"
                name="name"
                className={
                  errors.name
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                value={formValues.name}
                onChange={changeHandler}
              />
              {errors.name && (
                <div className="mb-3 text-red-600">{errors.name}</div>
              )}
            </div>
            <div className="form-floating mb-3">
              <select
                className={
                  errors.area
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                name="areaId"
                value={formValues.areaId}
                onChange={changeHandler}
              >
                <option value="">Select area</option>
                {area.map((item: IArea) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select area</label>
              {errors.area && (
                <div className="mb-3 text-red-600">{errors.area}</div>
              )}
            </div>
            <div className="form-floating mb-3">
              <select
                className={
                  errors.div
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                name="subDivisionId"
                value={formValues.subDivisionId}
                onChange={changeHandler}
              >
                <option value="">Select sub division</option>
                {subDivision.map((item: ISubDivision) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select sub division</label>
              {errors.div && (
                <div className="mb-3 text-red-600">{errors.div}</div>
              )}
            </div>
            <div className="form-floating mb-3">
              <select
                className={
                  errors.dist
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                name="districtId"
                value={formValues.districtId}
                onChange={changeHandler}
              >
                <option value="">Select district</option>
                {district.map((item: IDistrict) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select district</label>
              {errors.dist && (
                <div className="mb-3 text-red-600">{errors.dist}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={qrCheck}
                  id="flexCheckChecked"
                  onChange={() => {
                    setQrCheck(!qrCheck);
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Do you want to generate QR for this police station?
                </label>
              </div>

              <button className="btn btn-teal mr-3" onClick={InsertRecord}>
                Insert
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
