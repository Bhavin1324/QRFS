import React from "react";

function ServerAlert(props: { message: string }) {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {props.message}
      <button
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}

export default ServerAlert;
