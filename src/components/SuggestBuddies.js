import React from "react";
import Navbar from "./Navbar";
import { useState,useEffect } from "react";
import '../assets/css/Common.css';
import { getProfilePicture, getUserData } from "./Utility";
import config from "../config/config";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "./SuccessPopup";
const SuggestBuddies = () => {
    const [userData, setUserData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const { userId, firstName, lastName, username, count, budCount } = userData || {};

    const navigate = useNavigate();
    const handleUserNameClick = (userId) => {
      navigate(`/viewprofile/${userId}`);
    };

    useEffect(() => {
      const fetchUserData = async () => {
        const user = await getUserData(setUserData);
      };
  
      fetchUserData();
    }, []);

    const handleAddButtonClick = async (userId,reqUserId) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/${userId}/buddy-request/${reqUserId}`, {
          method: "POST",
          headers: config.API_HEADERS,
        });
        if (!response.ok) {
          throw new Error("Failed to add buddy");
        }
        const data = await response.json();
        console.log("Buddy added successfully:", data);
      } catch (error) {
        console.error("Error adding buddy:", error);
      }
    };
    
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/suggest-buddies/${userId}`, {
          method: "GET",
          headers: config.API_HEADERS,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }
        const data = await response.json();
        console.log("user",data.response)
        const suggestionsWithPictures = await Promise.all(
          data.response.map(async (user) => {
            if (!user.suggestedUser.profilePicBase64) {
              try {
                const profilePicResponse = await fetch(
                  `${config.API_BASE_URL}/api/users/${user.suggestedUser.userId}`,
                  { method: "GET", headers: config.API_HEADERS }
                );
  
                if (profilePicResponse.ok) {
                  const profilePicData = await profilePicResponse.json();
                  console.log("propic",profilePicData)
                  user.suggestedUser.profilePicBase64=profilePicData.response.profilePicBase64 ;
                  return user;
                }
              } catch (error) {
                console.error("Error fetching profile picture:", error);
              }
            }
            console.log("user",user)
            return user;
          })
        );
        setSuggestions(suggestionsWithPictures);
        console.log("Suggestions fetched:", suggestionsWithPictures);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    useEffect(() => {
      if (!userId) return; 
      fetchSuggestions();
    }, [userId]);

  return (
    <>
      <Navbar user={userData} reqC={count} budCount={budCount} setUserData={setUserData}></Navbar>
      <div className="common-background" >
      <section className="row justify-content-center mt-3 ">
        <div className="card " style={{ maxWidth: "42rem", marginLeft: "5%", opacity: "0.95" }}>
          <div className="card-body">
            <h5>You may Like to Add</h5>
            <div className="col-sm-12 col-md-12 mx-auto">
              <div className="suggestions justify-content-between mb-3">
              {suggestions.map((sug, index) => (
                  <div className="suggest-user" key={index}>
                    <div className="row ms-3">
                      <div className="col-md-2 col-sm-2">
                        <img
                          src= {getProfilePicture(sug.suggestedUser)}
                          style={{mmaxWidth: "3rem", maxHeight: "3rem", minWidth: "3rem", minHeight: "3rem",
                            borderRadius: "50%"}}
                          alt={`${sug.suggestedUser.firstName} ${sug.suggestedUser.lastName}`}
                        />
                      </div>
                      <div className="col-md-5 col-sm-5 mx-auto">
                        <h5>
                          <a
                            href={`/viewprofile/${sug.suggestedUser.userId}`}
                            className="profile-link"
                          >
                            {`${sug.suggestedUser.lastName} ${sug.suggestedUser.lastName}`}
                          </a>
                        </h5>
                        <p>Makes {sug.suggestedUser.category}</p>
                      </div>
                      <div className="col-md-3 col-sm-3 ml-auto">
                        <form >
                          <button className="btn btn-primary rounded-pill"
                           onClick={() => handleAddButtonClick(sug.suggestedUser.userId,userData.userId)} style={{ width: "6rem" }}>
                            Add
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default SuggestBuddies;