import React from "react";
import '../assets/css/UserProfile.css';
import ProfilePicUpload from "./ProfilePicUpload";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import UserAboutModal from "./UserAboutModal";
import UserCreationsModal from "./UserCreationsModal";
import ErrorPopup from "./ErrorPopup";
import { updateUserData, getProfilePicture } from "../api/Users";
import RecentPhotos from "./RecentPhotos";
import { fetchAllCreations, fetchDetailedCreations,updateUserDataDescription } from "../api/UserProfile";
import ViewBuddyModal from "./ViewBuddyModal";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [creations, setCreations] = useState([]);
  const [loadingCreations, setLoadingCreations] = useState(false);
  const { userId, firstName, lastName, username, buddiesCount, creationsCount } = userData || {};
  const [errorMessage, setErrorMessage] = useState('');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCreationsModal, setShowCreationsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [description, setDescription] = useState("No about info available");
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  const openModal = () => setShowBuddyModal(true);
  const closeModal = () => setShowBuddyModal(false);

  const handleSaveDescription = (newDescription) => {
    setShowAboutModal(false);
    saveAboutMe(newDescription);
  };


  const fetchCreations = async (userId) => {
    updateUserData(setUserData, userId);
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

  const saveAboutMe = async (newDescription) => {
    try {
      if (!userData?.userId) {
        console.log("user data:", userData);
        setErrorMessage("User ID is missing.");
        return;
      }
      console.log("user data:", userData);
      const updatedUserData = { ...userData, description: newDescription };
      const data = await updateUserDataDescription(updatedUserData);
      setDescription(newDescription);
      setErrorMessage("Description saved successfully");
      setUserData(data);
    } catch (error) {
      setErrorMessage(`Network error: ${error.message}`);
    }
  };
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      setUserData(storedData);
      const userId = storedData.userId;
      console.log("userId", userId);
      updateUserData(setUserData, userId);
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

  const handleImageUpload = (image) => {
    setIsProfilePicModalOpen(false);
  };
  return (
    <section className="h-100 gradient-custom-2">
      <Navbar user={userData} setUserData={setUserData} />
      <div className="container pt-0 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100" style={{ marginTop: "-10rem", marginBottom: "-4rem", paddingTop: "-0.1rem" }}>
          {errorMessage && <ErrorPopup errorMessage={errorMessage} />}
          <div className="col-12 col-lg-12 col-xl-12">
            <div className="card">
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "230px" }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px" }}>
                  <img
                    src={getProfilePicture(userData)} alt="Profile" className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ minWidth: "180px", maxHeight: "180px", minHeight: "180px", maxWidth: "180px", zIndex: "1" }}/>
                  <button type="button" className="btn btn-outline-dark upload-button" onClick={() => setIsProfilePicModalOpen(true)} style={{ position: 'relative', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                    Upload Picture
                  </button>
                </div>
                {isProfilePicModalOpen && (
                  <div className="modal fade show" style={{ display: "block" }} tabIndex="-1"
                    role="dialog" aria-hidden="false" >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content" style={{ display: "flex",flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "320px", width: "380px", textAlign: "center", border: "1px solid #ccc", borderRadius: "10px",
                        padding: "20px", backgroundColor: "#fff", position: "relative"
                      }} >
                        <div className="modal-header">
                          <button type="button" style={{ right: "25px", position: "absolute" }} className="btn-close" onClick={() => setIsProfilePicModalOpen(false)}
                            aria-label="Close" ></button>
                        </div>

                        <div className="modal-body">
                          {isProfilePicModalOpen && (
                            <ProfilePicUpload onImageUpload={handleImageUpload} userData={userData} setUserData={setUserData} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="ms-3" style={{ marginTop: "8rem" }}>
                  <h4 >{firstName + ' ' + lastName}</h4>
                  <p>{username}</p>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <p className="mb-1 h5">{creationsCount}</p>
                    <p className="small text-muted mb-0">
                      <button className="btn btn-link p-0" onClick={() => setShowCreationsModal(true)}
                        style={{ textDecoration: "none", fontSize: "20" }}>  Creations </button>
                    </p>
                  </div>
                  {showCreationsModal && (
                    <UserCreationsModal isOpen={showCreationsModal} onClose={() => setShowCreationsModal(false)}
                      onSubmit={() => fetchCreations(userData.userId)} userData={userData} />
                  )}
                  <div className="px-4">
                    <p className="mb-1 h5">{buddiesCount}</p>
                    <p className="small text-muted mb-0" >
                      <button className="btn btn-link p-0" onClick={openModal}
                        style={{ textDecoration: "none", fontSize: "20" }}>  Buddies  </button>
                    </p>
                    {showBuddyModal  && (<ViewBuddyModal userId={userData.userId} onClose={closeModal}/>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body p-4 text-black">
                <div className="mb-3">
                  <button className="btn btn-link p-0" onClick={() => setShowAboutModal(true)}
                    style={{ textDecoration: "none" }} >
                    <p className="lead fw-normal mb-1" id="About">About Me</p>
                  </button>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="font-italic mb-1">{userData.description}</p>
                  </div>
                </div>
                {showAboutModal && (
                  <UserAboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)}
                    currentDescription={userData.description} onSave={handleSaveDescription} />
                )}
              </div>
              <RecentPhotos creations={creations} loading={loadingCreations}  />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default UserProfile;
