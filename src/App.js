import React,  { useEffect }  from "react";
import ForumPage from "./components/ForumPage";
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import Signup from "./components/Signup";


function App() {

  const navigate = useNavigate();

  const isAuthenticated = false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<ForumPage />} />  
        <Route path="/signup" element={<Signup />} /> 
      </Routes>
    </div>
  );
}

export default App;
