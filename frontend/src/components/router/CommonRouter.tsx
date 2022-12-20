import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "../feedbackForm/FeedbackForm";
import NotFound from "../layout/NotFound";
import ProtactedRoute from "./ProtactedRoute";
import Login from "../logins/Login";
import LoginCard from "../logins/LoginCard";
import ORegistration from "../logins/ORegistration";
import Dashboard from "../dashboard/Dashboard";
import { NavigateToRoute } from "../../types/enums";
import PoliceStations from "../dashboard/PoliceStation/PoliceStations";
import SinglePoliceStation from "../dashboard/PoliceStation/SinglePoliceStation";
import Configuration from "../dashboard/PoliceConfig/Configuration";
import AddPoliceStation from "../dashboard/PoliceStation/AddPoliceStation";
import ConfigCockpit from "../dashboard/PoliceConfig/ConfigCockpit";
import Profile from "../dashboard/Profile";
import HPanel from "../dashboard/statistics/HPanel";

function CommonRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}>
            <Route index element={<LoginCard isOfficer={false} />} />
            <Route
              path={NavigateToRoute.HOME + "/:id"}
              element={<LoginCard isOfficer={false} />}
            />
            <Route
              path={NavigateToRoute.OFFICER}
              element={<LoginCard isOfficer={true} />}
            />
          </Route>
          <Route
            path={`${NavigateToRoute.OFFICER}/${NavigateToRoute.OFFICER_REGISTRATION}`}
            element={<ORegistration />}
          />
          <Route element={<ProtactedRoute />}>
            <Route
              path={NavigateToRoute.FEEDBACK_FORM}
              element={<FeedbackForm />}
            />
            <Route path={NavigateToRoute.DASHBOARD} element={<Dashboard />}>
              <Route index element={<HPanel />} />
              <Route
                path={NavigateToRoute.POLICE_STATIONS}
                element={<PoliceStations />}
              />
              <Route
                path={NavigateToRoute.POLICE_STATIONS + "/:id"}
                element={<SinglePoliceStation />}
              />
              <Route path={NavigateToRoute.CONFIG} element={<Configuration />}>
                <Route
                  path={NavigateToRoute.AREA}
                  element={<ConfigCockpit type="AREA" />}
                />
                <Route
                  path={NavigateToRoute.DIV}
                  element={<ConfigCockpit type="DIV" />}
                />
                <Route
                  path={NavigateToRoute.DISTRICT}
                  element={<ConfigCockpit type="DISTRICT" />}
                />
              </Route>
              <Route path={NavigateToRoute.PROFILE} element={<Profile />} />
              <Route
                path={NavigateToRoute.ADD_PS}
                element={<AddPoliceStation />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default CommonRouter;
