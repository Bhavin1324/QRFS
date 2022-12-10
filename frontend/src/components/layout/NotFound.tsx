import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="flex flex-col">
            <h2 className="inline-block mt-16 text-[140px] font-semibold self-center">
              404
            </h2>
            <div className="inline-block self-center text-lg">
              Page not found
            </div>
            <div
              className="self-center my-5 btn-teal"
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
