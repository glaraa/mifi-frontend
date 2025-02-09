import React, { useState, useEffect } from "react";
import {
  fetchUserRequests,
  acceptBuddyRequest,
  rejectBuddyRequest,
  fetchUserProfilePic
} from "../api/UserBuddies";
import {getUserData,getProfilePicture} from "../api/Users";
import Navbar from "./Navbar";
import '../assets/css/Common.css'

const BuddyRequest = () => {
  const [userData, setUserData] = useState(null);
  const {userId} = userData || {};
  const [userRequests, setUserRequests] = useState([]);

  const fetchData = async () => {
    try {
      const requestsResponse = await fetchUserRequests(userId);
      const requestsWithPictures = await Promise.all(
          requestsResponse.response.map(async (user) => {
            if (!user.requesterUser.profilePicBase64) {
              const profilePicBase64 = await fetchUserProfilePic(user.requesterUser.userId);
              if (profilePicBase64) {
                user.requesterUser.profilePicBase64 = profilePicBase64;
              }
            }
            return user;
          })
      );
      setUserRequests(requestsWithPictures);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if(userId) {
      fetchData();
    }
  }, [userData]);

  useEffect(()=>{
     getUserData(setUserData);
  },[])
  const handleAccept = async (userId,requesterUserId) => {
    try {
      await acceptBuddyRequest(userId,requesterUserId);
      await fetchData();
    } catch (error) {
      console.error("Error accepting buddy request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectBuddyRequest(requestId); 
      await fetchData();
    } catch (error) {
      console.error("Error rejecting buddy request:", error);
    }
  };

  return (
    <div>
      <Navbar user={userData} setUserData={setUserData}></Navbar>
      <section className="common-background row justify-content-center pt-3 pb-3 " style={{minHeight: "100vh"}}>
        <div className="card" style={{ maxWidth: "42rem",minHeight: "31.5rem",maxHeight: "31.5rem",marginLeft: "5%", opacity: "0.95" }}>
          <div className="card-body">
            <h5>Buddy Requests</h5>
            <div className="col-md-12 col-sm-12 pt-3">
              <div className="requests justify-content-between mb-3">
                {userRequests.map((req, index) => (
                  <div className="buddy-req" key={index}>
                    <div className="row">
                      <div className="col-md-2 col-sm-1">
                        <img
                          src={getProfilePicture(req.requesterUser)}
                          style={{maxWidth: "3rem", maxHeight: "3rem",
                            minWidth: "3rem", minHeight: "3rem", borderRadius: "50%"}}
                          alt="user"
                          className="profile-photo-lg"
                        />
                      </div>
                      <div className="col-md-5 col-sm-5">
                        <h5>
                          <a href={`view-profile/${req.requesterUser.userId}`} className="profile-link">
                            {req.requesterUser.firstName} {req.requesterUser.lastName}
                          </a>
                        </h5>
                        <p>Makes {req.requesterUser.category}</p>
                      </div>
                      <div className="col-md-2 col-sm-2">
                        <button className="btn btn-success"  style={{width: "5.5rem",fontSize:"0.9rem"}}
                                onClick={() => handleAccept(req.recipientUser.userId,req.requesterUser.userId)}>
                          Accept
                        </button>
                      </div>
                      <div className="col-md-2 col-sm-2">
                        <button className="btn btn-danger"  style={{width: "5.5rem",fontSize:"0.9rem"}}
                                onClick={() => handleReject(req.requestId)}>
                          Reject
                        </button>
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
  );
};

export default BuddyRequest;
