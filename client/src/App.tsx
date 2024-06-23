import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapCapture from "./pages/MapCapture";
import Home from "./pages/Home";
import TopRegions from "./components/TopRegions";
import { clearCredentials, setCredentials } from "./store/authSlice";
import { RootState } from "./store";

const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      dispatch(setCredentials({ token: storedToken, user: JSON.parse(storedUser) }));
    } else {
      dispatch(clearCredentials());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen h-screen dark">
        {/* Conditionally render Navbar if token exists */}
        {token && <Navbar />}
        <Routes>
          {!token ? (
            <>
              {/* Unauthenticated routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {/* Authenticated routes */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/capture" element={<MapCapture />} />
              <Route path="/top-regions" element={<TopRegions />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
