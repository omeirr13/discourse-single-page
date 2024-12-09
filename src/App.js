import React, { useEffect } from "react";
import ForumPage from "./components/ForumPage";
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import PostDetails from "./components/PostDetails";
import Home from "./components/Home";


function App() {

  const navigate = useNavigate();
  let isAuthenticated = false;
  const location = useLocation();

  const encryptedPassword = localStorage.getItem('salla_discourse_token');
  const encryptedUser = localStorage.getItem('salla_discourse_user');

  if (encryptedPassword && encryptedUser) {
    isAuthenticated = true;
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const showHeader = location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:postId" element={<PostDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
