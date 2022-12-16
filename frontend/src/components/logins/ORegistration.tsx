/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { IPoliceOfficer } from "../../types/PoliceOfficer";
import { useFetch } from "../../hooks/useFetch";
import { ApiKeysEnum, NavigateToRoute } from "../../types/enums";
import { IPoliceStation } from "../../types/PoliceStation";
import Swal from "sweetalert2";
interface IRegErrors {
  email?: string;
  name?: string;
  password?: string;
  ps?: string;
}
export default function ORegistration() {
  const navigate = useNavigate();
  const [cPass, setCPass] = useState("");
  const [policeStations, setPoliceStations] = useState<IPoliceStation[]>([]);
  const [formValues, setFormValues] = useState<IPoliceOfficer>({
    name: "",
    officerEmail: "",
    officerPassword: "",
    stationId: "",
  });
  const [formErrors, setFormErrors] = useState<IRegErrors>({});

  const ReqCreateOfficer = useFetch<IPoliceOfficer>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.REG_OFFICER}`,
    "POST",
    formValues
  );
  const ReqGetPoliceStation = useFetch<IPoliceStation[]>(
    `${process.env.REACT_APP_BASE_URL}${ApiKeysEnum.POLICE_STATIONS}`,
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

  function Validate(values: IPoliceOfficer) {
    const errors: IRegErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!values.name) {
      errors.name = "Name of police station is required";
    } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
      errors.name = "Name cannot contains numbers";
    }
    if (!values.officerEmail) {
      errors.email = `Email is required`;
    } else if (!emailRegex.test(values.officerEmail)) {
      errors.email = `Invalid email format`;
    }
    if (!values.officerPassword) {
      errors.password = "Password is requied";
    } else if (
      values.officerPassword.length < 5 ||
      values.officerPassword.length > 12
    ) {
      errors.password =
        "Lenght of the password must between 5 to 12 characters";
    } else if (values.officerPassword !== cPass) {
      errors.password = "Confirm password should be same as above";
    }
    if (!values.stationId) {
      errors.ps = "Please select your police station";
    }
    return errors;
  }
  async function submitData(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    try {
      const errs: IRegErrors = Validate(formValues);
      setFormErrors(errs);
      if (Object.keys(errs).length === 0) {
        const result = await ReqCreateOfficer();
        if (result) {
          Swal.fire({
            icon: "success",
            title: "Account has been created successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(`/${NavigateToRoute.OFFICER}`);
        }
      }
    } catch (ex) {
      console.log("Submit exeption", ex);
    }
  }
  useEffect(() => {
    ReqGetPoliceStation()
      .then((result) => setPoliceStations(result))
      .catch((ex) => console.log("Unable to get police stations", ex));
  }, []);

  return (
    <div className="container mt-5 px-4">
      <div className="row">
        <div className="flex gap-4">
          <div
            className="self-center text-lg"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackOutlinedIcon className="cursor-pointer" />
          </div>
          <div className="fs-2 my-3">Officer registration</div>
        </div>
        <div className="col-md-6">
          <form>
            <div className="form-group">
              <label className="mb-1">Enter name</label>
              <input
                type="text"
                name="name"
                className={
                  formErrors.name
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                value={formValues.name}
                onChange={changeHandler}
              />
              {formErrors.name && (
                <div className="mb-3 text-red-600">{formErrors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label className="mb-1">Enter email</label>
              <input
                type="email"
                name="officerEmail"
                className={
                  formErrors.email
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                placeholder="example@xmail.com"
                value={formValues.officerEmail}
                onChange={changeHandler}
              />
              {formErrors.email && (
                <div className="mb-3 text-red-600">{formErrors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label className="mb-1">Enter password</label>
              <input
                type="password"
                name="officerPassword"
                className={
                  formErrors.password
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                value={formValues.officerPassword}
                onChange={changeHandler}
              />
              {formErrors.password && (
                <div className="mb-3 text-red-600">{formErrors.password}</div>
              )}
            </div>
            <div className="form-group">
              <label className="mb-1">Re enter password to confirm</label>
              <input
                type="password"
                name="cPass"
                className={
                  formErrors.password
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                value={cPass}
                onChange={(e) => {
                  setCPass(e.target.value);
                }}
              />
              {formErrors.password && (
                <div className="mb-3 text-red-600">{formErrors.password}</div>
              )}
            </div>
            <div className="form-floating mb-3">
              <select
                className={
                  formErrors.ps
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                name="stationId"
                value={formValues.stationId}
                onChange={changeHandler}
              >
                <option value="">Select police station</option>
                {policeStations.map((item: IPoliceStation) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <label>Select police your police station</label>
              {formErrors.ps && (
                <div className="mb-3 text-red-600">{formErrors.ps}</div>
              )}
            </div>
            <div>
              <button className="btn btn-teal" onClick={submitData}>
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
