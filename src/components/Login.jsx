import React from "react";
import "../assets/css/Login.css"; 
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ErrorPopup from "./ErrorPopup";
import {loginUser} from "../api/api";

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
        await loginUser(loginData,navigate,setErrorMessage);
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
          <a href="/forgot-password"> Forgot password? </a> or <a href="/register">Sign up</a>
        </div>
        {errorMessage && <ErrorPopup errorMessage={errorMessage} />}
      </div>
    </div>
  );
}

export default Login;
