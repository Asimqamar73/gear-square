import { Navigate } from "react-router-dom";

function PrivateRoute({ children }: { children: any }) {
  const user = localStorage.getItem("gear-square-user");
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}

export default PrivateRoute;
