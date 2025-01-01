import React from "react";
import '../assets/css/UserProfile.css';
import ProfilePicUpload from "./ProfilePicUpload";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import UserAboutModal from "./UserAboutModal";
import UserCreationsModal from "./UserCreationsModal";
import config from "../config/config"; 
import ErrorPopup from "./ErrorPopup";
import { updateUserData,getProfilePicture,fetchUserDataFromAPI } from "./Utility";
import RecentPhotos from "./RecentPhotos";
import { useParams } from "react-router-dom";

const ViewProfile = () => {
  const { userId } = useParams();
  const [loggedUserData, setLoggedUserData] =useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [creations, setCreations] = useState([]);
  const [loadingCreations, setLoadingCreations] = useState(false);
  const {firstName, lastName, username, count, budCount } = userData || {};
  const [isLoading, setIsLoading] = useState(true);

 
  const fetchCreations = async (userId) => {
    setLoadingCreations(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/${userId}/creations/all`, {
        method: "GET",
        headers: config.API_HEADERS,
      });
      if (!response.ok) throw new Error("Failed to fetch creations.");
      const creationIdsResponse = await response.json();
      console.log("creation response ",creationIdsResponse)
      const creationDetailsPromises = creationIdsResponse.response.map(async (creation) => {
        const detailResponse = await fetch(`${config.API_BASE_URL}/api/users/creations/${creation.creationId}`, {
          method: "GET",
          headers: config.API_HEADERS,
        });
        if (!detailResponse.ok) throw new Error(`Failed to fetch creation details for ${creation.creationId}`);
        return detailResponse.json();
      });
      const details = await Promise.all(creationDetailsPromises);
      setCreations(details.map(detail => detail.response));
    } catch (error) {
      console.error("Error fetching creations:", error);
    } finally {
      setLoadingCreations(false);
    }
  };


  useEffect(() => {
    const data=fetchUserDataFromAPI(userId);
    setUserData(data);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    console.log("localStorage data from userprofile", storedData);
    if (storedData) {
      setLoggedUserData(storedData);
      const loggedInUserId = storedData.userId;
      updateUserData(setLoggedUserData,loggedInUserId);
      fetchCreations(userId);
    } else {
      navigate("/");
    }
    setIsLoading(false); 
  }, []);
  
  if (isLoading) {
    return <p>Loading...</p>; 
  }

  if (!userData) {
    navigate("/")
  }

  return (
    <section className="h-100 gradient-custom-2">
      <Navbar user={loggedUserData} reqC={count} budCount={budCount} setLoggedUserData={setLoggedUserData} />
      <div className="container pt-0 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100" style={{ marginTop: "-10rem", marginBottom: "-4rem", paddingTop: "-0.1rem" }}>
          <div className="col-12 col-lg-12 col-xl-12">
            
            <div className="card">

              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "230px" }}>

                <div className="ms-4 mt-5 d-flex flex-column" style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px" }}>
                  <img
                    src={getProfilePicture(userData)}
                    alt="Profile"
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px", zIndex: "1" }}
                  />
                  <button type="button" className="btn btn-outline-dark upload-button"  style={{ position: 'relative', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                    Upload Picture
                  </button>
                </div>


                <div className="ms-3" style={{ marginTop: "8rem"}}>
                  <h4 >{userData.firstName + ' ' + userData.lastName}</h4>
                  <p>{userData.username}</p>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <p className="mb-1 h5">34</p>
                    <p className="small text-muted mb-0">
                      <button className="btn btn p-0"
                        style={{ textDecoration: "none",fontSize:"20" }}>  Creations </button>
                    </p>
                  </div>
                  <div className="px-4">
                    <p className="mb-1 h5">23</p>
                    <p className="small text-muted mb-0">
                    <button className="btn btn p-0" 
                        style={{ textDecoration: "none",fontSize:"20" }}>  Buddies  </button>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body p-4 text-black">
                <div className="mb-3">
                  <button  className="btn btn p-0" 
                  style={{ textDecoration: "none" }} >
                    <p className="lead fw-normal mb-1" id="About">About Me</p>
                  </button>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="font-italic mb-1">{userData.description}</p>
                  </div>
                </div>
              </div>
                 <RecentPhotos creations={creations} loading={loadingCreations} />
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ViewProfile;
