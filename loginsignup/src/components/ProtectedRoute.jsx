import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()

  const { singleUser } = useSelector((state) => state.user);
  useEffect(() => {
    console.log("singleUser", singleUser, singleUser.roles?.[0]?.roleName);
  }, [ singleUser]);
  // If singleUser is not logged in, redirect to login
//   if (!singleUser || Object.keys(singleUser).length === 0) {
//     return <Navigate to="/login" />;
//   }
if (!singleUser) {
    return navigate("/login")
}
  // If singleUser is not an admin, redirect to unauthorized page or home
  if (!singleUser.roles?.some(role => role.roleName === "Admin")) {
    return navigate("/login")
}
  return children;
};

export default ProtectedRoute;
