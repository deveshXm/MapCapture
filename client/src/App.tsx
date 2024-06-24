import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapCapture from "./pages/MapCapture";
import TopRegions from "./pages/TopRegions";

import { clearCredentials, setCredentials } from "./store/authSlice";
import { RootState } from "./store";
import { Title } from "./components/ui/Title";
import Navbar from "./components/navbar";
import TrendingRegions from "./pages/TrendingRegions";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    if (storedToken && storedUser) {
      dispatch(setCredentials({ token: storedToken, user: JSON.parse(storedUser) }));
    } else {
      dispatch(clearCredentials());
    }
    console.log("first", { storedToken, storedUser, token });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="h-screen dark flex justify-center items-center">
        <Title>Map Capture</Title>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen  dark flex flex-col">
        {/* Conditionally render Navbar if token exists */}
        {token && <Navbar />}
        {!token ? (
          <Routes>
            {/* Unauthenticated routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <div className="p-4 flex flex-1 items-center justify-center">
            <Routes>
              {/* Authenticated routes */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/capture" element={<MapCapture />} />
              <Route path="/top-regions" element={<TopRegions />} />
              <Route path="/trending" element={<TrendingRegions />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
