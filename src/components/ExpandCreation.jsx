import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateUserData,getProfilePicture } from "../api/Users";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./Navbar";
import '../assets/css/Common.css'
import {fetchComments, uploadComment, deleteCreation, fetchCommentsWithProfilePics} from "../api/Creation";
import {fetchUserProfilePic} from "../api/UserBuddies";
import {fetchDetailedCreations} from "../api/UserProfile";
import SuggestionCard from "./SuggestionCard";

const ExpandCreation = () => {
  const { creationId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [creation, setCreation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, firstName, lastName, username, count, budCount } = userData || {};

  const handleDelete = async (id) => {
    console.log('Deleting post with ID:', id);
    await deleteCreation(creationId, userId);
    navigate(`/user-profile`);
  };


  const handleAddComment = async (newCommentText) => {
    if (!newCommentText.trim()) return;

    const commentRequest = {
      byUserId: userData.userId,
      commentText: newCommentText,
      creationId: creationId,
    };

    try {
      await uploadComment(commentRequest);
      setNewComment("");
      const updatedComments = await fetchCommentsWithProfilePics(creationId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error handling new comment:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCreation();
        const updatedComments = await fetchCommentsWithProfilePics(creationId);
        setComments(updatedComments);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [creationId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCreation();
        const updatedComments = await fetchCommentsWithProfilePics(creationId);
        setComments(updatedComments);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [creationId]);

  const fetchCreation = async () => {
    setLoading(true);
      const data = await fetchDetailedCreations(creationId);
      setCreation(data.response);
  };

  if (!creation) {
    return <p>Creation not found.</p>;
  }

  return (
    <div className="common-background">
    <Navbar  user={userData} setUserData={setUserData} />
    <div className="container mt-0 pt-3 pb-3 pe-0">
      <div className="row g-0 pe-0 pt-0 mt-0" >
        <div className="col-md-6 pe-2" style={{paddingTop:"-3rem",overflowY: "auto"}}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex mb-4">
                <div className="row w-100">
                  <div className="col-md-2">
                    <img src={getProfilePicture(creation.user)} className="border rounded-circle me-2"
                         alt="Avatar" style={{
                      minHeight: "2.5rem", maxHeight: "2.5rem", minWidth: "2.5rem",
                      maxWidth: "2.5rem"
                    }}/>
                  </div>
                  <div className="col-md-9">
                    <a href={`view-profile/${creation.user.userId}`} className="text-dark mb-0">
                      <strong>
                        {`${creation.user.firstName} ${creation.user.lastName}`}
                      </strong>
                    </a>
                    <p className="text-muted d-block" style={{marginTop: "-6px"}}>
                      <small>{creation.createdDate}</small>
                    </p>
                  </div>
                  { userId == creation.user.userId &&
                  <div className="col-md-1">
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm dropdown-toggle" type="button" id="postOptions"
                              data-bs-toggle="dropdown" aria-expanded="false" style={{justifyContent:"center"}}>
                        <FontAwesomeIcon icon={faEllipsisVertical}/>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="postOptions">
                        <li>
                          <button className="dropdown-item text-danger"
                                  onClick={() => handleDelete(creation.creationId)}>
                            Delete
                          </button>
                        </li>
                        {/*<li>*/}
                        {/*  <button className="dropdown-item text-primary"*/}
                        {/*          onClick={() => handleUpdate(creation.creationId)}>*/}
                        {/*    Update*/}
                        {/*  </button>*/}
                        {/*</li>*/}
                      </ul>
                    </div>
                  </div>
                  }
                </div>
              </div>
              <div className="row">
                <p>{creation.caption}</p>
              </div>
              <div className="bg-image hover-overlay ripple rounded-0" data-mdb-ripple-color="light">
                <img src={`data:image/jpeg;base64,${creation.creationBase64}`} className="w-100"
                     alt="Post" style={{maxWidth: "100%", maxHeight: "300px"}} />
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex mb-3">
                <a href="/">
                  <img src={getProfilePicture(userData)} className="border rounded-circle me-2" alt="Avatar"
                       style={{height: "2.5rem",width: "2.5rem"}}/>
                </a>
                <div className="form-outline w-100">
                  <div className="row">
                    <div className="col-md-10 col-sm-10">
                      <textarea   className="form-control"  id="comment" name="comment"
                                  rows="2" value={newComment} placeholder="Write a comment..."
                                  onChange={(e) => setNewComment(e.target.value)}>

                      </textarea>
                    </div>
                    <div className="col-md-2 col-sm-2">
                      <button className="btn btn-success" style={{position: "relative", float: "left"}}
                              onClick={() => handleAddComment(newComment)}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {comments.map((c, index) => (
                  <div className="d-flex mb-3" key={index}>
                    <a href={`/view-profile/${c.byUser.userId}`}>
                      <img src={getProfilePicture(c.byUser)} className="border rounded-circle me-2"
                           alt="Avatar"
                           style={{maxWidth: "2.5rem", maxHeight: "2.5rem", minWidth: "2.5rem", minHeight: "2.5rem"}}/>
                    </a>
                    <div>
                      <div className="bg-light rounded-3 px-3 mb-1 py-1" style={{minWidth: '75vh'}}>
                        <a href={`/view-profile/${c.byUser.userId}`} className="text-dark mb-2" style={{fontSize: "small"}}>
                          <strong>{`${c.byUser.firstName} ${c.byUser.lastName}`}</strong>
                        </a>
                        <small className="text-muted d-block" style={{fontSize: "small"}}>{c.commentText}</small>
                        <small style={{fontSize: "xx-small", right: "10%", position: "absolute"}}>{c.commentedAt}</small>

                      </div>
                    </div>

                  </div>

              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6 pe-3 ps-4" style={{
          position: "sticky", top: 0,
          overflow: "auto", maxHeight: "515px",minHeight: "515px"}}>
          <div className="card h-100 pe- 3">
            <div className="card-body ">
              <div className="d-flex mb-3 ">
                <div className="row h-100 w-100">
                  <h5>You may Like to Add</h5>
                  {userId ? (
                      <SuggestionCard userId={userId} limit={4}/>
                  ) : (
                      <div>Loading user data...</div>
                  )}
                  <i><a style={{fontSize: "medium", right: "10%", position: "absolute"}} href={"/suggest-buddies"}>View more</a></i>
                </div>
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
