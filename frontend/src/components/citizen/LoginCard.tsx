function LoginCard() {
  return (
    <div className="i-card-container-a">
      <div className="i-card-body">
        <div className="fs-2 my-3">Login</div>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="mb-1">
              Enter email
            </label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="example@xmail.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="mb-1">
              Enter OTP
            </label>
            <input type="number" className="form-control mb-3" />
          </div>
          <button className="btn-teal-oline mr-2">Get OTP</button>
          <button className="btn-teal-oline mx-2">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
