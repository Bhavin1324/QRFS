/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { IArea } from "../types/Area";
import { IPoliceOfficer } from "../types/PoliceOfficer";
import Login from "./components/citizen/Login";
import { useFetch } from "./hooks/useFetch";

function App() {
  return <Login />;
}

export default App;
