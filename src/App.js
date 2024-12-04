import React from "react";
import ForumPage from "./components/ForumPage";
import { Route, Routes } from 'react-router-dom'; 
import Signup from "./components/Signup";


function App() {
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
