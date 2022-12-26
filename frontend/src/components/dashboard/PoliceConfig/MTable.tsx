import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { IArea } from "../../../types/Area";
import { IDistrict } from "../../../types/District";
import { ISubDivision } from "../../../types/SubdDivision";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetch } from "../../../hooks/useFetch";
import { ApiKeysEnum, NavigateToRoute } from "../../../types/enums";
import Swal from "sweetalert2";

interface IMTableProps {
  data: IArea[] | ISubDivision[] | IDistrict[];
  onEffect: any;
  onFilter?: any;
}
export default function MTable(props: IMTableProps) {
  const route = window.location.href.split("/");
  const [formValues, setFormValues] = useState<
    IArea | IDistrict | ISubDivision
  >({ name: "" });
  const [errors, setErrors] = useState<{ name?: string }>({
    name: "",
  });

  const ReqPostArea = useFetch<IArea>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.AREAS,
    "POST",
    formValues
  );
  const ReqPostSubDivision = useFetch<ISubDivision>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.SUB_DIVISION,
    "POST",
    formValues
  );
  const ReqPostDistrict = useFetch<IDistrict>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.DISTRICTS,
    "POST",
    formValues
  );
  const ReqDeleteArea = useFetch<IArea>(
    process.env.REACT_APP_BASE_URL + `${ApiKeysEnum.AREAS}/`,
    "DELETE"
  );
  const ReqDeleteSubDivision = useFetch<ISubDivision>(
    process.env.REACT_APP_BASE_URL + `${ApiKeysEnum.SUB_DIVISION}/`,
    "DELETE"
  );
  const ReqDeleteDistrict = useFetch<IDistrict>(
    process.env.REACT_APP_BASE_URL + `${ApiKeysEnum.DISTRICTS}/`,
    "DELETE"
  );

  const changeHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  function Validate(values: IArea | IDistrict | ISubDivision) {
    const err: { name?: string } = {};
    if (!values.name) {
      err.name = "Name is required to be inserted";
    }
    return err;
  }

  async function addData(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    try {
      const err = Validate(formValues);
      setErrors(err);
      if (Object.keys(err).length === 0) {
        if (route[route.length - 1] === NavigateToRoute.AREA) {
          const resultArea = await ReqPostArea();
          props.onEffect(resultArea);
          setFormValues({ name: "" });
          if (resultArea) {
            Swal.fire({
              icon: "success",
              title: "Area has been inserted",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
        if (route[route.length - 1] === NavigateToRoute.DIV) {
          const resultDiv = await ReqPostSubDivision();
          props.onEffect(resultDiv);
          setFormValues({ name: "" });
          if (resultDiv) {
            Swal.fire({
              icon: "success",
              title: "Subdivision has been inserted",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
        if (route[route.length - 1] === NavigateToRoute.DISTRICT) {
          const resultDistrict = await ReqPostDistrict();
          props.onEffect(resultDistrict);
          setFormValues({ name: "" });
          if (resultDistrict) {
            Swal.fire({
              icon: "success",
              title: "District has been inserted",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      }
    } catch (ex) {
      console.log("Insertion expetion MTable:", ex);
    }
  }

  async function deleteHandler(id: string) {
    Swal.fire({
      title: "Are you sure you want to delete this record?",
      text: "You won't be able to revert this change!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#115e59",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (route[route.length - 1] === NavigateToRoute.AREA) {
            ReqDeleteArea(id).then((result) => {
              if (result) {
                props.onEffect(result, true);
                Swal.fire(
                  "Deleted!",
                  "Record deleted successfully.",
                  "success"
                );
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Conflict foreign key",
                  text: "Delete police stations first which contains this area",
                });
              }
            });
          }
          if (route[route.length - 1] === NavigateToRoute.DIV) {
            ReqDeleteSubDivision(id).then((result) => {
              if (result) {
                props.onEffect(result, true);
                Swal.fire(
                  "Deleted!",
                  "Record deleted successfully.",
                  "success"
                );
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Conflict foreign key",
                  text: "Delete police stations first which contains this sub division",
                });
              }
            });
          }
          if (route[route.length - 1] === NavigateToRoute.DISTRICT) {
            ReqDeleteDistrict(id).then((result) => {
              if (result) {
                props.onEffect(result, true);
                Swal.fire(
                  "Deleted!",
                  "Record deleted successfully.",
                  "success"
                );
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Conflict foreign key",
                  text: "Delete police stations first which contains this district",
                });
              }
            });
          }
        } catch (ex) {
          console.log("Delete config excpeiton : ", ex);
        }
      }
    });
  }
  function searchValue(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    const dataList = props.data.filter((item) =>
      item.name.toLowerCase().includes(formValues.name.toLowerCase())
    );
    props.onFilter(dataList);
  }
  function resetValue(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    const dataList: any = [];
    props.onFilter(dataList);
    setFormValues({ name: "" });
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <form>
          <div className="form-group mt-4">
            <label className="mb-1">Enter police station name</label>
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
          <div>
            <button className=" btn btn-teal" onClick={addData}>
              Add
            </button>
            <button className=" btn btn-teal ml-3" onClick={searchValue}>
              Search
            </button>
            <button className=" btn btn-teal ml-3" onClick={resetValue}>
              Reset table
            </button>
          </div>
        </form>
      </div>
      <div className="col-xs-12">
        <table className="table mt-2">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((item: IArea | IDistrict | ISubDivision) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteHandler(item.id || "");
                      }}
                    >
                      <Tooltip title="Delete" placement="right">
                        <DeleteIcon />
                      </Tooltip>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
