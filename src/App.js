import React,  { useEffect }  from "react";
import ForumPage from "./components/ForumPage";
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import Signup from "./components/Signup";
import Login from "./components/Login";


function App() {

  const navigate = useNavigate();
  let isAuthenticated = false;

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

  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<ForumPage />} />  
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </div>
  );
}

export default App;
