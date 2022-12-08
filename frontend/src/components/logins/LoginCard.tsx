import { Link } from "react-router-dom";
import LoginNav from "../layout/LoginNav";
export interface ILoginCardProps {
  isOfficer: boolean;
}

function LoginCard(props: ILoginCardProps) {
  return (
    <div className="i-card-container-a">
      <div className="i-card-body">
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
              id="email"
              className="form-control mb-3"
              placeholder="example@xmail.com"
            />
          </div>
          {props.isOfficer ? (
            <>
              <div className="form-group">
                <label htmlFor="password" className="mb-1">
                  Enter password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control mb-3"
                />
              </div>
              <div className="flex">
                <button className="btn-teal-oline mr-2">Login</button>
                <Link
                  to="/plane/o-registration"
                  className="t-link-primary self-center ml-auto px-2"
                >
                  Create an account
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="otp" className="mb-1">
                  Enter OTP
                </label>
                <input type="number" id="otp" className="form-control mb-3" />
              </div>
              <button className="btn-teal-oline mr-2">Get OTP</button>
              <button className="btn-teal-oline mx-2">Login</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
