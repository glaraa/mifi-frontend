import React from "react";
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import UserProfile from './components/UserProfile';
import ExpandCreation from "./components/ExpandCreation";
import SuggestBuddies from "./components/SuggestBuddies";
import ViewProfile from "./components/ViewProfile";
import BuddyRequest from "./components/BuddyRequest";
import FeedPage from "./components/FeedPage";
import ForgotPassword from "./components/ForgotPassword"
import Settings from "./components/Settings";
import DeleteAccount from "./components/DeleteAccount";


function App() {
  
  return (
    <div className="background">
       <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/expand/:creationId" element={<ExpandCreation />} />
        <Route path="view-profile/:userId" element={<ViewProfile />} />
        <Route path="/suggest-buddies" element={<SuggestBuddies />} />
        <Route path="/buddy-request" element={<BuddyRequest/>}/>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

