import React from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Header from "./components/Header";
import PostDetails from "./components/PostDetails/PostDetails";
import Home from "./components/Home/Home";
import CategoryPosts from "./components/Category/CategoryPosts";
import ReactionsBar from "./components/ReactionBar";


function App() {

  const location = useLocation();

  const showHeader = location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reactions" element={<ReactionsBar />} />
        <Route path="/detail/:topicId/:postNumber?" element={<PostDetails />} />
        <Route path="/category-detail/:categoryId" element={<CategoryPosts />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
