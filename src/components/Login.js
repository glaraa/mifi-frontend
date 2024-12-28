import React from "react";
import "../assets/css/Login.css"; 
import { useEffect } from "react";
import { useState } from "react";
import config from "../config/config"; 
import { useNavigate } from 'react-router-dom';
import ErrorPopup from "./ErrorPopup";

function Login() {
    useEffect(() => {
        document.body.className = "body-login";
        return () => {
          document.body.className = ""; 
        };
      }, []);
      const [errorMessage, setErrorMessage] = useState('');
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
      
      const handleLogin = async (e) => {
        e.preventDefault(); 
        const loginData = {
          username: username,password: password,
        };
        try {
          const response = await fetch(`${config.API_BASE_URL}/api/login`, {
            method: "POST",
            headers: config.API_HEADERS,
            body: JSON.stringify(loginData),
          });
          const data = await response.json();        
          if (response.ok) {
            console.log("Size of data:", JSON.stringify(data).length);
            localStorage.setItem("userData", JSON.stringify(data));
            navigate('/userprofile');
          } else {
            console.log("Login failed:", data);
            setErrorMessage(data.message || 'Invalid username & Password');
          }
        } catch (error) {
          console.error("Error:", error);
          setErrorMessage('Something went wrong');
        }
      };
      
  return (
    <div className="col col-xs-10">
      <div className="wrapper">
        <div className="logo">
          <img src="/assets/images/MiFilogo.png" alt="Logo here" />
        </div>
        <div className="text-center xs mt-4 name">Make it Flaunt it</div>
        <form className="p-6 mt-3" onSubmit={handleLogin}>
          <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input type="text" name="username" id="regUserName" placeholder="Username" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password" name="password" id="pwd" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn mt-3">Login</button>
        </form>
        <div className="text-center fs-6">
          or <a href="/register">Sign up</a>
        </div>
        {errorMessage && <ErrorPopup errorMessage={errorMessage} />}
      </div>
    </div>
  );
}

export default Login;
