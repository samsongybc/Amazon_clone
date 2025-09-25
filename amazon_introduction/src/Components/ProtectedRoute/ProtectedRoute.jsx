// import React from "react";
// import { Navigate } from "react-router-dom";
// import { DataContext } from "../DataProvider/DataProvider";

// const ProtectedRoute = ({ children, msg, redirect }) => {
//     const navigate = useNavigate();
//   const [{ user, dispatch }] = useContext(DataContext);

//   useEffect(() => {
   
//   if (!user) {
//     Navigate("/auth",{state: { msg, redirect}});
//   }
// },[user]);
//   return children;
// };

// export default ProtectedRoute;


// // Auth.jsx --- import {useLocation} from "react-router-dom";
// // in Router.jsx <Payments/> routed to ProtectedRoute
