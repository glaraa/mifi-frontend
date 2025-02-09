import React, {useEffect, useState} from 'react';
import {fetchUserBuddies, fetchUserProfilePic, removeBuddy} from "../api/UserBuddies";
import {getProfilePicture} from "../api/Users";

const ViewBuddyModal =  ({ userId, onClose }) => {
    const [userBuddies, setUserBuddies] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        const userBuddies= await fetchUserBuddies(userId);
        const buddiesWithPictures = await Promise.all(
            userBuddies.response.map(async (buddy) => {
                if (!buddy.buddyUser.profilePicBase64) {
                    const profilePicBase64 = await fetchUserProfilePic(buddy.buddyUser.userId);
                    if (profilePicBase64) {
                        buddy.buddyUser.profilePicBase64 = profilePicBase64;
                    }
                }
                return buddy;
            })
        );

        setUserBuddies(buddiesWithPictures);
        setLoading(false);
    }

    useEffect(() =>{
        fetchData();
    },[]);

    const onRemoveBuddy = async (buddyUserId) => {
        try {
            await removeBuddy(userId,buddyUserId);
            await fetchData();
        } catch (error) {
            console.error("Error rejecting buddy request:", error);
        }
    };

    return (
        loading ? (
            <div className="loader">
                <span>Loading...</span>
            </div>
        ) : (
            <div
                id="modal-success-buddyview"
                tabIndex="-1"
                className={`modal modal-message modal-success fade ${onClose ? 'show' : ''}`}
                style={{display: onClose ? 'block' : 'none'}}
                aria-hidden={!onClose}
            >
                <div className="modal-dialog" >
                    <div className="modal-content" >
                        <div className="modal-header ps-2 ">
                            <h6 className="mb-1">Your Buddies</h6>
                            <button
                                style={{width: "1rem", height: "1rem", border: "none", background: "transparent", display: "flex",
                                    alignItems: "center", position: "absolute", top:18,right: 15, justifyContent: "right", cursor: "pointer"}}
                                type="button"
                                onClick={onClose}>
                                ✖</button>
                        </div>
                        <div className="modal-body pt-2">
                            <div className="profile-container">
                                <div className="row row-space-20">
                                    <div className="col-md-10">
                                        <div className="tab-content p-0">
                                            <div className="tab-pane fade active show" id="profile-friends">
                                                <ul className="friend-list clearfix">
                                                    {userBuddies.map((bud, index) => (
                                                        <li key={index}>
                                                            <div className="row">
                                                                <div className="col-md-2 justify-content-start">
                                                                    <div className="friend-img">
                                                                        <img src={getProfilePicture(bud.buddyUser)}
                                                                             alt="" style={{minWidth: '3rem', maxWidth: '3rem',
                                                                            minHeight: '3rem', maxHeight: '3rem', borderRadius: '50%'
                                                                        }}/>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="friend-info"></div>
                                                                    <div className="row-md-3  justify-content-start">
                                                                        <a href={`view-profile/${bud.buddyUser.userId}`}>
                                                                            <small>{`${bud.buddyUser.firstName} ${bud.buddyUser.lastName}`}</small>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3 justify-content-start">
                                                                    <button
                                                                        style={{maxWidth:"4.9rem",maxHeight:"2rem", fontSize:"0.8rem"}}
                                                                        className="btn btn-danger btn-xs rounded-pill"
                                                                        onClick={() => onRemoveBuddy(bud.buddyUser.userId)}>
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <hr/>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
};
export default ViewBuddyModal;
