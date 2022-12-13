/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { ICitizenResponse } from "../../types/CitizenResponse";
import { ApiKeysEnum } from "../../types/enums";
import { IOptions } from "../../types/Options";
import { IQuestion } from "../../types/Questions";
import ServerAlert from "../designed/ServerAlert";

function FeedbackForm() {
  const [formValue, setFormValues] = useState<ICitizenResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<IQuestion[]>([]);
  const getQuestions = useFetch<IQuestion>(
    process.env.REACT_APP_BASE_URL + ApiKeysEnum.QUESTIONS_LIST,
    "GET",
    { text: "" },
    localStorage.getItem("token") || ""
  );

  const GetQuestions = async () => {
    try {
      const resp = await getQuestions();
      setResponse(resp);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetQuestions();
  }, []);

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {}

  console.log(response);
  return (
    <div className="container mt-4">
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && response.length === 0 && (
        <ServerAlert message="Oops! Cannot find questions." />
      )}
      {response.length > 0 && (
        <div className="row">
          <div className="fs-2 my-2">Provide your feedback</div>
          <div className="col-xs-12">
            <form className="pb-6">
              {response.map((item: IQuestion, index: number) => {
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
                              value={option.text}
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
              <div className="d-grid gap-2 col-6 mx-auto">
                <button className="btn-teal" type="button">
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
