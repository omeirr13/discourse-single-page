import React from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import PostDetails from "./components/PostDetails";
import Home from "./components/Home";


function App() {

  const location = useLocation();

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
