import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.auth);
    // Check token in localStorage as a fallback, because Redux state might be lost on refresh 
    // (though authSlice usually restores it, let's rely on Redux state if it's persisted or init logic exists)
    // Assuming authSlice logs in from token on load or we just check token here:
    const token = localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
