import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "../feedbackForm/FeedbackForm";
import NotFound from "../layout/NotFound";
import ProtactedRoute from "../layout/ProtactedRoute";
import Login from "../logins/Login";
import LoginCard from "../logins/LoginCard";
import ORegistration from "../logins/ORegistration";

function CommonRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}>
            <Route index element={<LoginCard isOfficer={false} />} />
            <Route path="officer" element={<LoginCard isOfficer={true} />} />
          </Route>
          <Route element={<ProtactedRoute />}>
            <Route index path="fform" element={<FeedbackForm />} />
            <Route path="o-registration" element={<ORegistration />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default CommonRouter;
