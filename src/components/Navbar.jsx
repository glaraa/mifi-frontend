import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import '../assets/css/UserProfile.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {getProfilePicture } from "../api/Users";
const Navbar = ({ user,setUserData }) => {

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
      console.log("userData", storedUserData);
    }
  }, []);

  const logoutUser = () => {
    localStorage.clear();    
  }
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light pt -0 pb-0" style={{maxHeight: "2.9rem",minHeight:"2.9rem", position: 'sticky', top: 0, zIndex: 10}}>
      <div className="container-fluid   " style={{ marginBottom: "-0.95rem", marginTop: "-0.7 rem" }}>
        <a className="navbar-brand pt-0 pb-0 ms-4" style={{ marginTop: "-1.2rem" }} href="/user-profile">
          <font size="3.5rem">
            <b>MiFi</b>
          </font>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
          <span className="navbar-toggler-icon" style={{ width: "0.1rem" }}></span>
        </button>

        <ul className="collapse navbar-collapse mr-auto" id="navbarNav">
          <li className="nav-item dropdown p-1">
            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink"
              role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={getProfilePicture(user)}
                style={{ minWidth: "1.6rem", maxWidth: "1.6rem", minHeight: "1.6rem", maxHeight: "1.6rem" }}
                className="rounded-circle" height="22" alt="User Profile" loading="lazy" />
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li> <Link className="dropdown-item" to="/user-profile"> My Profile </Link> </li>
              <li>  <Link className="dropdown-item" to="/settings"> Settings </Link> </li>
              <li> <Link className="dropdown-item" to="/" onClick={logoutUser} > Logout </Link> </li>
            </ul>
          </li>
          <li className="nav-item p-2 dropdown">
            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink2"
              role="button" data-bs-toggle="dropdown" aria-expanded="false" >
              <img src="/assets/images/AddBuddyIcon.png" style={{ width: "1.6rem" }} />
              {user && user.buddyRequestsCount > 0 && (
                  <span className="badge rounded-pill badge-notification bg-danger">
    {user.buddyRequestsCount}
  </span>
              )}

            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink2">
              <li> <Link className="dropdown-item" to="/suggest-buddies"> Buddy Suggestions </Link> </li>
              <li>  <Link className="dropdown-item" to="/buddy-request"> Buddy Requests </Link> </li>
            </ul>
          </li>
          <li>  <Link to="/feed"> <img src="/assets/images/feedlogo.png" style={{ width: "1.8rem" }} /> </Link> </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
