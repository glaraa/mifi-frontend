import React from "react";
import "../assets/css/Registration.css"; 
import { useEffect } from "react";
import { useState } from "react";
import config from "../config/config"; 
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "./ErrorPopup";
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    useEffect(() => {  
      document.body.className = "body-register";
        return () => {
          document.body.className = ""; 
        };
      }, []);
        const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
      
        useEffect(() => {
          const handler = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);
          return () => {
            clearTimeout(handler);
          };
        }, [value, delay]);
        return debouncedValue;
      };
        const [query, setQuery] = useState("");
        const [error, setError] = useState("");
        const [isAvailable, setIsAvailable] = useState(null); 
        const [errorMessage, setErrorMessage] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
        const navigate = useNavigate();
        const [formData, setFormData] = useState({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          category: "Painting",
          password: "",
          confirmPassword: "",
        });

        
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (formData.username.length < 3) {
        setErrorMessage("Username must be at least 3 characters long.");
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setErrorMessage("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }
      const response = await fetch(`${config.API_BASE_URL}/api/users/`, {
        method: "POST",
        headers: config.API_HEADERS,
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Sign Up Successful');
        navigate('/');
        setErrorMessage('');
      } else {
        setErrorMessage(result.message || 'Sign Up Failed');
      }
    } catch (error) {
      console.error("Error during Sign Up:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

    const debouncedQuery = useDebounce(query, 500); 

    useEffect(() => {
      if (debouncedQuery.length >= 3) {
        const fetchData = async () => {
          try {
            console.log("Headers",config.API_HEADERS)
            const response = await fetch( 
              `${config.API_BASE_URL}/api/users/unique/${debouncedQuery}`, {
                method: "GET", headers: config.API_HEADERS,
              }
            );
            const data = await response.json();
            if (data && typeof data.response === "boolean") {
              setIsAvailable(data.response);
            } else {
              setIsAvailable(null);
            }
          } catch (error) {
            console.error("Error during API call:", error,config.headers);
            setIsAvailable(null);
          }
        };
        fetchData();
          } else {
            setIsAvailable(null); 
          }
        }, [debouncedQuery]);
           
  return (
    <div className="wrapper-register">
    <h2 align="center">Sign Up!</h2>
    <form onSubmit={handleSubmit}>
      <div className="input-box">
          <input type="text"placeholder="Enter your username" name="username" value={formData.username}
            onChange={(e) => {
              setQuery(e.target.value); handleInputChange(e);
            }}/>
        </div>
        <div>
          {error && <p className="error-message">{error}</p>}
          {isAvailable !== null && (
            <p style={{ color: isAvailable ? "green" : "red", fontSize: "14px", textAlign: "center",}}>
              {isAvailable ? "Username is available" : "Username is already taken"}
            </p>
          )}
        </div>
      <div className="input-box">
        <input type="text" placeholder="Enter your first name" name="firstName" value={formData.firstName}
         onChange={handleInputChange} required/>
      </div>
      <div className="input-box">
        <input type="text" placeholder="Enter your last name" name="lastName" value={formData.lastName}
        onChange={handleInputChange} required />
      </div>
      <div className="input-box">
        <input type="email" placeholder="Enter your email" name="email" value={formData.email}
          onChange={handleInputChange} required />
      </div>
      <div>
        <input type="radio" id="male" name="gender" value="MALE" onChange={handleInputChange}/>
        <label htmlFor="male">Male</label>
        <input type="radio" id="female" name="gender" value="FEMALE" onChange={handleInputChange}/>
        <label htmlFor="female">Female</label>
        <input type="radio" id="others" name="gender" value="OTHER" onChange={handleInputChange} required/>
        <label htmlFor="others">Prefer not to say</label>
      </div>
      <div className="category">
        <label htmlFor="category">I make&nbsp;</label>
        <select id="category-value" name="category" value={formData.category} onChange={handleInputChange}required>
          <option value="Painting">Painting</option>
          <option value="Sketches">Sketches</option>
          <option value="Handicrafts">Handicrafts</option>
          <option value="Origami">Origami</option>
          <option value="Edibles">Edibles</option>
          <option value="Jewelleries">Jewelleries</option>
          <option value="Stitching">Stitching</option>
          <option value="Art">Other Arts</option>
        </select>
      </div>
      <div className="input-box">
        <input type="password" placeholder="Create password" name="password"  value={formData.password} 
        onChange={handleInputChange} required/>
      </div>
      <div className="input-box">
        <input type="password" placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword}
          onChange={handleInputChange} required/>
      </div>
      <div className="input-box button">
        <input type="submit" value="Register Now" />
      </div>
      <div className="text">
        <h3>Already have an account? <a href="/">Login now</a></h3>
      </div>
    </form>
    {errorMessage && <ErrorPopup errorMessage={errorMessage} />}
    {successMessage && <SuccessPopup message={successMessage} />}
  </div>
  );
};
export default Registration;
