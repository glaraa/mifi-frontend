import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../assets/css/UserProfile.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ user, reqC, budCount }) => {

  const [userInfo, setUserInfo] = useState(user || {}); 

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserInfo(storedUserData);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light pb-0" style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <div className="container-fluid " style={{ marginBottom: "-0.8rem", marginTop: "-0.7 rem" }}>
        <a className="navbar-brand pt-0 pb-0" style={{ marginTop: "-1.2rem" }} href="#">
          <font size="3.5rem">
            <b>MiFi</b>
          </font>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
          <span className="navbar-toggler-icon" style={{ width: "0.8rem" }}></span>
        </button>

        <ul className="collapse navbar-collapse mr-auto" id="navbarNav">
          <li className="nav-item dropdown p-1">
            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink"
              role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={userInfo.userProPic ? `data:image/jpeg;base64,${userInfo.profilePicBase64}` : "/assets/images/default.webp"}
                style={{ minWidth: "1.6rem", maxWidth: "1.6rem", minHeight: "1.6rem", maxHeight: "1.6rem" }}
                className="rounded-circle" height="22" alt="User Profile" loading="lazy" />
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <Link className="dropdown-item" to="/user"> My Profile </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/user/settings"> Settings </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/logout"> Logout </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item p-2 dropdown">
            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink2"
              role="button" data-bs-toggle="dropdown" aria-expanded="false" >
              <img src="/assets/images/AddBuddyIcon.png" style={{ width: "1.6rem" }} />
              <span className="badge rounded-pill badge-notification bg-danger">{reqC}</span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink2">
              <li>
                <Link className="dropdown-item" to="/user/buddy_sug"> Buddy Suggestions </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/user/buddy_req"> Buddy Requests </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/user/feed"> <img src="/assets/images/feedlogo.png" style={{ width: "1.8rem" }} /> </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
