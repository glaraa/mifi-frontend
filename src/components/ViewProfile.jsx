import React from "react";
import '../assets/css/UserProfile.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { updateUserData,getProfilePicture,fetchUserDataFromAPI } from "../api/Users";
import RecentPhotos from "./RecentPhotos";
import { useParams } from "react-router-dom";
import {fetchAllCreations, fetchDetailedCreations, fetchUserRelation} from "../api/UserProfile";
import {acceptBuddyRequest, addBuddyRequest} from "../api/UserBuddies";

const ViewProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] =useState(null);
  const [viewUserData, setViewUserData] = useState(null);
  const [profileRelation, setProfileRelation] = useState(null);
  const navigate = useNavigate();
  const { firstName, lastName, username, description,buddiesCount, creationsCount  } = viewUserData || {};
  const [creations, setCreations] = useState([]);
  const [loadingCreations, setLoadingCreations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchCreations = async (userId) => {
    setLoadingCreations(true);
    try {
      const creationIdsResponse = await fetchAllCreations(userId);
      const creationDetailsPromises = creationIdsResponse.response.map(async (creation) => {
        return fetchDetailedCreations(creation.creationId);
      });
      const details = await Promise.all(creationDetailsPromises);
      setCreations(details.map(detail => detail.response));
    } catch (error) {
      console.error("Error fetching creations:", error);
    } finally {
      setLoadingCreations(false);
    }
  };

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if(userId==storedData.userId){
      navigate("/user-profile")
    }
    async function fetchUsersRelation(id, viewUserId) {
      const data = await fetchUserRelation(storedData.userId, viewUserId);
      console.log(data.response);
      setProfileRelation(data.response);
    }
    fetchUsersRelation(storedData.userId,userId)

  },[])

  const fetchAndSetData = async (userId) => {
      const data = await fetchUserDataFromAPI(userId);
      if (data?.response) {
        setViewUserData(data.response);
      }
  };

  useEffect(() => {
    fetchAndSetData(userId);
  },[]);

  const callApi= async(profileRelation, userId, viewUserId)=> {
    if (profileRelation === 'ADD') {
      await addBuddyRequest(viewUserId,userId);
    }
    if(profileRelation === 'RESPOND') {
      await acceptBuddyRequest(userId, viewUserId);
    }
    const data=await fetchUserRelation(viewUserId,userId);
    setProfileRelation(data.response);
  }

  useEffect(() => {
    fetchCreations(userId );
  }, [ userId]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      setUserData(storedData);
      const loggedInUserId = storedData.userId;
      updateUserData(setUserData,loggedInUserId);
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
      <Navbar user={userData} setUserData={setUserData} />
      <div className="container pt-0 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100" style={{ marginTop: "-10rem", marginBottom: "-4rem", paddingTop: "-0.1rem" }}>
          <div className="col-12 col-lg-12 col-xl-12">
            <div className="card">
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "230px" }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px" }}>
                  <img src={getProfilePicture(viewUserData)} alt="Profile" className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px", zIndex: "1" }}/>
                  <button  onClick={() => callApi(profileRelation, userData.userId, userId)}  type="button" className="btn btn-outline-dark upload-button"
                           disabled={profileRelation === 'BUDDIES'} style={{ position: 'relative', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                    {profileRelation}
                  </button>
                </div>
                <div className="ms-3" style={{ marginTop: "8rem"}}>
                  <h4 >{firstName + ' ' + lastName}</h4>
                  <p>{username}</p>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <p className="mb-1 h5">{creationsCount}</p>
                    <p className="small text-muted mb-0">
                      <button className="btn btn p-0"
                        style={{ textDecoration: "none",fontSize:"20" }}>  Creations </button>
                    </p>
                  </div>
                  <div className="px-4">
                    <p className="mb-1 h5">{buddiesCount}</p>
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
                    <p className="font-italic mb-1">{description}</p>
                  </div>
                </div>
              </div>
              {profileRelation === 'BUDDIES' && <RecentPhotos creations={creations} loading={loadingCreations} />}
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ViewProfile;
