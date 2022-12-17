/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { IArea } from "../../../types/Area";
import { IDistrict } from "../../../types/District";
import { ApiKeysEnum } from "../../../types/enums";
import { IPoliceStation } from "../../../types/PoliceStation";
import { ISubDivision } from "../../../types/SubdDivision";
interface IFilterStationProps {
  data: IPoliceStation[];
  onFilter?: any;
}
function FilterStaions(props: IFilterStationProps) {
  const [formValues, setFormValues] = useState<IPoliceStation>({
    name: "",
    areaId: "",
    districtId: "",
    subDivisionId: "",
  });
  const [area, setArea] = useState<IArea[]>([]);
  const [subDivision, setSubDivision] = useState<ISubDivision[]>([]);
  const [district, setDistrict] = useState<IDistrict[]>([]);

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
  const filterHandler = () => {
    const dataList = props.data.filter(
      (item) =>
        item.areaId === formValues.areaId ||
        item.districtId === formValues.districtId ||
        item.subDivisionId === formValues.subDivisionId
    );
    console.log(formValues);
    console.log(dataList);
    props.onFilter(dataList);
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
  }, [formValues]);
  return (
    <div className="row">
      <div className="col-md-4">
        <div className="mx-2 mb-2">
          <div className="form-floating mb-3">
            <select
              className="form-control mb-3"
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
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="mx-2 mb-2">
          <div className="form-floating mb-3">
            <select
              className="form-control mb-3"
              name="subDivisionId"
              value={formValues.subDivisionId}
              onChange={changeHandler}
            >
              <option value="">Select sub divison</option>
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
        </div>
      </div>
      <div className="col-md-4">
        <div className="mx-2 mb-2">
          <div className="form-floating mb-3">
            <select
              className="form-control mb-3"
              name="districtId"
              value={formValues.districtId}
              onChange={changeHandler}
            >
              <option value="">Select District</option>
              {district.map((item: IArea) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <label>Select District</label>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="mx-2 mb-2">
          <div className="form-group">
            <label className="mb-1">Enter police station name</label>
            <input
              type="text"
              name="name"
              className="form-control inline-block"
              value={formValues.name}
              onChange={changeHandler}
              onInput={() => {
                props.onFilter(
                  props.data.filter((item) =>
                    item.name
                      .toLowerCase()
                      .includes(formValues.name.toLocaleLowerCase())
                  )
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-md-3 flex">
        <div className="mx-2 mt-[2px] self-end mb-2">
          <button className="btn btn-teal" onClick={filterHandler}>
            Filter
          </button>
        </div>
        <div className="mx-2 mt-[2px] self-end mb-2">
          <button
            className="btn btn-teal"
            onClick={() => {
              setFormValues({
                areaId: "",
                districtId: "",
                subDivisionId: "",
                name: "",
              });
              props.onFilter([]);
            }}
          >
            Reset table
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterStaions;
