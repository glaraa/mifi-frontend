import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../config/config";
import { updateUserData,getProfilePicture } from "./Utility";
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./Navbar";
import '../assets/css/Common.css'
  
const ExpandCreation = () => {
  const { creationId } = useParams();
  const [userData, setUserData] = useState(null);
  const [creation, setCreation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { userId, firstName, lastName, username, count, budCount } = userData || {};

  const handleDelete = (id) => {
    console.log('Deleting post with ID:', id);
  };

  const handleUpdate = (id) => {
    console.log('Updating post with ID:', id);
  };

  const handleAddComment = (comment) => {
    console.log('Adding comment:', comment);
  };

   useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData) {
        setUserData(storedData);
        const userId = storedData.userId;
        console.log("userId", userId);
        updateUserData(setUserData,userId);
        fetchCreation(userId);
      } else {
        navigate("/");
      }
      setIsLoading(false); 
    }, []);
    
  useEffect(() => {
    fetchCreation();
  }, [creationId]);
  const fetchCreation = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/creations/${creationId}`,
        {
          method: "GET",
          headers: config.API_HEADERS,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch creation details");
      }
      const data = await response.json();
      setCreation(data.response);
    } catch (error) {
      console.error("Error fetching creation details:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <p>Loading creation details...</p>;
  }

  if (!creation) {
    return <p>Creation not found.</p>;
  }

  return (
    <div className="common-background">
    <Navbar  user={userData} reqC={count} budCount={budCount} setUserData={setUserData} />
    <div className="container mt-0 pe-0">
      <div className="row g-1 pe-0 pt-0 mt-0" >
        <div className="col-md-6 pe-5" style={{paddingTop:"-3rem"}}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex mb-4">
                <div className="row w-100">
                  <div className="col-md-3">
                    <img src={getProfilePicture(userData)}  className="border rounded-circle me-2"
                      alt="Avatar" style={{  minHeight: "2.5rem", maxHeight: "2.5rem", minWidth: "2.5rem",
                        maxWidth: "2.5rem"}} />
                  </div>
                  <div className="col-md-6">
                    <a href={`/user/bud_profile/${userData.username}`}  className="text-dark mb-0" >
                      <strong>
                        {`${userData.firstName} ${userData.lastName}`}
                      </strong>
                    </a>
                    <a  href="#"  className="text-muted d-block" style={{ marginTop: "-6px" }} >
                      <small>{userData.createdDate}</small>
                    </a>
                  </div>
                  <div className="col-md-3">
                    <div className="dropdown">
                      <button  className="btn btn-light btn-sm dropdown-toggle" type="button" id="postOptions"
                        data-bs-toggle="dropdown" aria-expanded="false" >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                      <ul  className="dropdown-menu" aria-labelledby="postOptions" >
                        <li>
                          <button  className="dropdown-item text-danger"  onClick={() => handleDelete(creation.creationId)} >
                            Delete
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-primary"  onClick={() => handleUpdate(creation.creationId)} >
                            Update
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <p>{creation.caption}</p>
              </div>

              <div  className="bg-image hover-overlay ripple rounded-0" data-mdb-ripple-color="light" >
                <img src={`data:image/jpeg;base64,${creation.creationBase64}`} className="w-100"
                  alt="Post" style={{ maxWidth: "100%", maxHeight: "300px"}}
                />
              </div>
            </div>
          </div>
        </div>

          <div className="col-md-6 pe-3 ps-4"style={{ position:"sticky"}}>
          <div className="card h-100 pe- 3">
            <div className="card-body ">
              <div className="d-flex mb-3 ">
                <div className="row h-100 w-100">
                  <div className="col-md-3 ">
                    

                   </div></div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default ExpandCreation;
