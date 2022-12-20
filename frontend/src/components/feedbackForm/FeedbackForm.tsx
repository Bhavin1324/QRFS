/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetch } from "../../hooks/useFetch";
import { ICitizenResponse } from "../../types/CitizenResponse";
import { ApiKeysEnum, NavigateToRoute } from "../../types/enums";
import { IOptions } from "../../types/Options";
import { IQuestion } from "../../types/Questions";
import { convertToDashedDate, TokenValidation } from "../../Utils/Common";
import ServerAlert from "../CustomElement/ServerAlert";
import WarningAlert from "../CustomElement/WarningAlert";

interface Iformtype {
  questionId: string;
  optionId: string;
}

function FeedbackForm() {
  const tokenValid = TokenValidation();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<Iformtype[]>([]);
  const [formErrors, setFormErrors] = useState<{ msg?: string }>({});
  const [postResponse, setPostResponse] = useState<ICitizenResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const getQuestions = useFetch<IQuestion>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.QUESTIONS_LIST,
    "GET",
    { text: "" },
    localStorage.getItem("token") || ""
  );
  const ReqPostResponse = useFetch<ICitizenResponse[]>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.CITIZEN_RESPONSE,
    "POST",
    postResponse
  );

  const GetQuestions = async () => {
    try {
      const resp = await getQuestions();
      setQuestions(resp);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((previousValue: Iformtype[]) => {
      let tmp = [];
      for (let item of previousValue) {
        if (item.questionId !== name) {
          tmp.push(item);
        }
      }
      tmp.push({
        questionId: name,
        optionId: value,
      });
      return tmp;
    });
  };

  function constructResponse() {
    let respArr: ICitizenResponse[] = [];
    for (let item of formValues) {
      respArr.push({
        ...item,
        stationId: localStorage.getItem("psid") || "",
        responseDate: convertToDashedDate(new Date().toLocaleDateString()),
      });
    }
    return respArr;
  }

  function Validate(values: any) {
    const err: { msg?: string } = {};
    if (Object.keys(values).length < 7) {
      err.msg = "All answers are required";
    }
    return err;
  }

  async function handleSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) {
    try {
      e.preventDefault();
      const err = Validate(formValues);
      setFormErrors(err);
      if (Object.keys(err).length === 0) {
        const result: { isSuccess: boolean; message?: string } =
          await ReqPostResponse();
        if (result.isSuccess) {
          Swal.fire(
            "Success!",
            "Response has been recorded successully!",
            "success"
          );
          localStorage.removeItem("token");
          navigate(`${NavigateToRoute.HOME}${localStorage.getItem("psid")}`);
        }
      }
    } catch (ex) {
      console.error("Excepiton occured while submitting the response", ex);
    }
  }

  useEffect(() => {
    GetQuestions();
  }, []);

  useEffect(() => {
    const data = constructResponse();
    setPostResponse(data);
  }, [formValues]);

  return (
    <div className="container mt-4">
      {tokenValid.type !== "CLIENT" && <Navigate to={NavigateToRoute.HOME} />}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && questions.length === 0 && (
        <ServerAlert message="Unable to fetch questions from the server." />
      )}
      {questions.length > 0 && (
        <div className="row">
          <div className="fs-2 my-2 col-md-6">Provide your feedback </div>
          <div className="col-md-6 text-right">
            <button
              className="btn btn-dark my-2 mr-2"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("psid");
                navigate(NavigateToRoute.HOME);
              }}
            >
              Logout
            </button>{" "}
          </div>
          <div className="col-xs-12">
            <form className="pb-6">
              {questions.map((item: IQuestion, index: number) => {
                return (
                  <div className="form-group stripe-card text-lg" key={item.id}>
                    <div className="mb-2">
                      <span className="font-semibold mr-2">{index + 1})</span>
                      {item.text}
                    </div>
                    {!item.isDescriptive ? (
                      item.options?.map((option: IOptions) => {
                        return (
                          <div className="form-check" key={option.id}>
                            <input
                              className="form-check-input"
                              type="radio"
                              id={option.id}
                              name={option.questionId}
                              value={option.id}
                              onChange={changeHandler}
                            />
                            <label
                              htmlFor={option.id}
                              className="form-check-label"
                            >
                              {option.text}
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a comment here"
                          id={item.id}
                        ></textarea>
                        <label htmlFor={item.id}>
                          Describe your experiance...
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
              {formErrors.msg && <WarningAlert message={formErrors.msg} />}

              <div className="d-grid gap-2 col-6 mx-auto">
                <button
                  className="btn-teal"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackForm;
