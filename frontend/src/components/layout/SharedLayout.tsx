import { Outlet } from "react-router-dom";

function SharedLayout() {
  return (
    <>
      <div>This is shared layout</div>
      <Outlet />
    </>
  );
}

export default SharedLayout;
