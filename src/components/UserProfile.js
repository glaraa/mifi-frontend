import React from "react";
import '../assets/css/UserProfile.css'; 
import ProfilePicUpload from "./ProfilePicUpload";
import { useEffect,useState} from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { firstName, lastName, username, description, count, budCount, creations } = userData || {};
  const creationList = creations || [];
  const [showModal, setShowModal] = useState(false);
  const aboutDescription = description || "No about info available";


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    console.log("localStorage data",storedData)
    setUserData(storedData);
  }, []);

  if (!userData) {
    navigate("/")
  }

  const getProfilePicture = () => {
    if (userData?.profilePicBase64) {
      return `data:image/jpeg;base64,${userData.profilePicBase64}`;
    }
    if (userData?.gender === "MALE") {
      return "/assets/images/MaleDefault.jpg"; 
    } else if (userData?.gender === "FEMALE") {
      return "/assets/images/FemaleDefault.jpg"; 
    }
    return "/assets/images/default.webp"; 
  };

  
  const handleImageUpload = (image) => {
    console.log("Image uploaded:", image);
    setShowModal(false); 
  };
  return (
    <section className="h-100 gradient-custom-2">
      <Navbar user={userData} reqC={count} budCount={budCount} />
      <div className="container pt-0 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100" style={{marginTop:"-8rem", paddingTop: "-0.1rem"}}>
          <div className="col col-lg-9 col-xl-7">
            <div className="card">
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "200px" }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ minWidth: "150px", maxHeight: "150px", minHeight: "150px", maxWidth: "150px" }}>
                  <img
                     src={getProfilePicture()}
                     alt="Profile"
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ minWidth: "150px", maxHeight: "150px", minHeight: "150px", maxWidth: "150px", zIndex: "1" }}
                  />
                 
                 <button type="button" className="btn btn-outline-dark upload-button" onClick={() => setShowModal(true)} style={{ position: 'relative', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                    Upload Picture
                  </button>
                </div>

                <div className="ms-3" style={{ marginTop: "8rem" }}>
                  <h5>{firstName + ' ' + lastName}</h5>
                  <p>{username}</p>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <p className="mb-1 h5">{count}</p>
                    <p className="small text-muted mb-0">
                      <a href="#modal-success-addimg" data-bs-toggle="modal" data-bs-target="#modal-success-addimg">Creations</a>
                    </p>
                  </div>
                  <div className="px-3">
                    <p className="mb-1 h5">{budCount}</p>
                    <p className="small text-muted mb-0">
                      <a href="#modal-success-addimg" data-bs-toggle="modal" data-bs-target="#modal-success-buddyview">Buddies</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-body p-4 text-black">
                <div className="mb-5">
                  <a href="#" data-bs-toggle="modal" data-bs-target="#modal-success">
                    <p className="lead fw-normal mb-1" id="About">About</p>
                  </a>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="font-italic mb-1">{description || 'No about info available'}</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="lead fw-normal mb-0">Recent photos</p>
              </div>
              <div className="row g-2">
                {/* {userData.creations && userData.creations.map((creation, index) => (
                  <div className="col mb-2" key={index}>
                    <a href={`/user/creation_det/${creation.srNo}`}><img src={`/path/to/creations/${creation.image}`} alt="Creation" className="w-100 rounded-3" /></a>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
