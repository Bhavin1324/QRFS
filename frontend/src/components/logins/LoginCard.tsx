/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ICitizenCred } from "../../types/CitizenCredentials";
import { ILoginForm } from "../../types/Common";
import { ApiKeysEnum } from "../../types/enums";
import { useFetch } from "../../hooks/useFetch";
import LoginNav from "../layout/LoginNav";
import ServerAlert from "../designed/ServerAlert";

interface ILoginCardProps {
  isOfficer: boolean;
}

function LoginCard(props: ILoginCardProps) {
  const navigate = useNavigate();
  const initalFormState: ILoginForm = {
    email: "",
    errors: {},
    otp: "",
    password: "",
  };
  const [isOtp, setIsOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<ILoginForm>(initalFormState);
  const [response, setResponse] = useState<ICitizenCred>({ citizenEmail: "" });
  const loginReq = useFetch<ICitizenCred>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.LOGGIN_CITIZEN,
    "POST",
    { citizenEmail: formValues.email }
  );
  const varifyReq = useFetch<ICitizenCred>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.VARIFY_OTP,
    "POST",
    { otp: formValues.otp.toString(), citizenEmail: formValues.email }
  );

  function Validate(values: {
    email?: string;
    password?: string;
    otp?: string;
  }) {
    const err: {
      email?: string;
      password?: string;
      otp?: string;
      validOtp?: string;
    } = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!values.email) {
      err.email = `Email is required`;
    } else if (!emailRegex.test(values.email)) {
      err.email = `Invalid email format`;
    }
    if (!values.otp && !props.isOfficer && isOtp) {
      err.otp = `Otp is required`;
    }
    if (!values.password && props.isOfficer) {
      err.password = `Password is required`;
    }
    return err;
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const GetOTP = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      if (!isOtp) {
        const errors = Validate(formValues);
        setFormValues({ ...formValues, errors: errors });
        if (Object.keys(errors).length === 0) {
          setIsOtp(true);
          const resp = await loginReq();
          setResponse(resp);
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        const resp = await loginReq();
        setIsLoading(false);
        setResponse(resp);
      }
    } catch (ex) {
      setIsOtp(false);
      setIsLoading(false);
      console.info(ex);
    }
  };

  const LoginHandler = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const errors = Validate(formValues);
    setFormValues({ ...formValues, errors: errors });
    if (props.isOfficer) {
      console.log("officer login");
    } else {
      if (Object.keys(errors).length === 0) {
        const result: ICitizenCred = await varifyReq();
        if (result.token && result.loginSuccess) {
          setResponse({
            ...response,
            loginSuccess: result.loginSuccess,
            token: result.token,
          });
          localStorage.setItem("token", result.token);
          navigate("/plane/fform");
        } else {
          setFormValues({
            ...formValues,
            errors: {
              ...errors,
              validOtp: "Entered OTP is invlaid for given email",
            },
          });
        }
      }
    }
  };

  return (
    <div className="i-card-container-a">
      <div className="i-card-body">
        {!isLoading && !isOtp && (
          <ServerAlert message="Unable to get the server" />
        )}
        <LoginNav />
        <div className="fs-2 my-3">
          {props.isOfficer ? "Officer " : "Citizen"} Login
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="mb-1">
              Enter email
            </label>
            <input
              type="email"
              name="email"
              className={
                formValues.errors.email
                  ? "form-control invalid-control mb-1"
                  : "form-control mb-3"
              }
              placeholder="example@xmail.com"
              value={formValues.email}
              onChange={changeHandler}
            />
            {formValues.errors.email && (
              <div className="mb-3 text-red-600">{formValues.errors.email}</div>
            )}
          </div>
          {props.isOfficer ? (
            <div className="form-group">
              <label htmlFor="password" className="mb-1">
                Enter password
              </label>
              <input
                type="password"
                name="password"
                className={
                  formValues.errors.password
                    ? "form-control invalid-control mb-1"
                    : "form-control mb-3"
                }
                value={formValues.password}
                onChange={changeHandler}
              />
              {formValues.errors.password && (
                <div className="mb-3 text-red-600">
                  {formValues.errors.password}
                </div>
              )}
            </div>
          ) : (
            isOtp && (
              <>
                <div className="form-group">
                  <label htmlFor="otp" className="mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="number"
                    name="otp"
                    className={
                      formValues.errors.otp || formValues.errors.validOtp
                        ? "form-control invalid-control mb-1"
                        : "form-control mb-3"
                    }
                    value={formValues.otp}
                    onChange={changeHandler}
                  />
                  {(formValues.errors.otp || formValues.errors.validOtp) && (
                    <div className="mb-3 text-red-600">
                      {formValues.errors.validOtp || formValues.errors.otp}
                    </div>
                  )}
                </div>
              </>
            )
          )}
          <div className="flex">
            {!props.isOfficer && (
              <button
                className={
                  isLoading && isOtp
                    ? "btn-disabled mr-2"
                    : "btn-teal-oline mr-2"
                }
                onClick={GetOTP}
                disabled={isLoading && isOtp}
              >
                {isLoading && isOtp && (
                  <span className="mr-2 spinner-border spinner-border-sm"></span>
                )}
                {isOtp ? "Resend" : "Get OTP"}
              </button>
            )}
            <button
              className={
                !isOtp && !props.isOfficer
                  ? "btn-disabled mr-2"
                  : "btn-teal-oline mr-2"
              }
              onClick={LoginHandler}
              disabled={!props.isOfficer && !isOtp}
            >
              Login
            </button>
            {props.isOfficer && (
              <Link
                to="/plane/o-registration"
                className="t-link-primary self-center ml-auto px-2"
              >
                Create an account
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
