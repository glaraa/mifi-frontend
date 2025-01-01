import React from "react";
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import UserProfile from './components/UserProfile';
import ExpandCreation from "./components/ExpandCreation";
import SuggestBuddies from "./components/SuggestBuddies";
import ViewProfile from "./components/ViewProfile";


function App() {
  
  return (
    <div className="background">
       <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/expand/:creationId" element={<ExpandCreation />} />
        <Route path="/viewprofile/:userId" element={<ViewProfile />} />
        <Route path="/suggestbuddies" element={<SuggestBuddies />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

