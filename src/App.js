import React from "react";
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import UserProfile from './components/UserProfile';


function App() {
  
  return (
    <div className="background">
       <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

