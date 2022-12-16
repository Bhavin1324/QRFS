import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { IArea } from "../../../types/Area";
import { IDistrict } from "../../../types/District";
import { ApiKeysEnum } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import { ISubDivision } from "../../../types/SubdDivision";

interface IUpdatePoliceStationProps {
  data: IPoliceStation;
  onUpdate: any;
}

export default function UpdatePoliceStation(props: IUpdatePoliceStationProps) {
  const [qrCheck, setQrCheck] = useState<boolean>(false);
  const [area, setArea] = useState<IArea[]>([]);
  const [subDivision, setSubDivision] = useState<ISubDivision[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);
  const GetStation = useFetch<IPoliceStation>(
    process.env.REACT_APP_BASE_URL +
      ApiKeysEnum.POLICE_STATIONS +
      `/${props.data.id}`,
    "GET",
    { name: "", areaId: "", districtId: "", subDivisionId: "", qrUrl: "" },
    localStorage.getItem("token") || ""
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

  const [formValues, setFormValues] = useState<IPoliceStation>(props.data);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const UpdateReq = useFetch<IPoliceStation>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}/${props.data.id}`,
    "PATCH",
    formValues
  );

  const changeHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const Validate = (values: IPoliceStation) => {
    const err: { name?: string } = {};
    if (!values.name) {
      err.name = "Please enter police station name";
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
    if (
      area.length === 0 ||
      subDivision.length === 0 ||
      district.length === 0
    ) {
      GetInitialData();
    }
  }, []);

  const UpdateForm = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setErrors(Validate(formValues));

    try {
      if (Object.keys(errors).length === 0) {
        if (qrCheck) {
          formValues.qrUrl = !props.data.qrUrl
            ? `${process.env.REACT_APP_QR_URL}localhost:3000/${props.data.id}`
            : "";
        }
        await UpdateReq();
        const result = await GetStation();
        props.onUpdate(result);
      }
    } catch (ex) {
      console.error("form update exception", ex);
    }
  };
  return (
    <>
      <div className="row">
        <div className="mt-2 mb-2 fs-3">Update police station</div>
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
                className="form-select form-control"
                name="areaId"
                value={formValues.areaId}
                onChange={changeHandler}
              >
                {area.map((item: IArea) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select area</label>
            </div>
            <div className="form-floating mb-3">
              <select
                className="form-select form-control"
                name="subDivisionId"
                value={formValues.subDivisionId}
                onChange={changeHandler}
              >
                {subDivision.map((item: ISubDivision) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select sub division</label>
            </div>
            <div className="form-floating mb-3">
              <select
                className="form-select form-control"
                name="districtId"
                value={formValues.districtId}
                onChange={changeHandler}
              >
                {district.map((item: IDistrict) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select district</label>
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
                  {!props.data.qrUrl
                    ? "Do you want to generate QR for this police station?"
                    : "Do you want to remove QR code?"}
                </label>
              </div>

              <button className="btn btn-teal mr-3" onClick={UpdateForm}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
