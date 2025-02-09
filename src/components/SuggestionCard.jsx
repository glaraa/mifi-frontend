import React, { useState, useEffect } from 'react';
import {addBuddyRequest, fetchSuggestedBuddies, fetchUserProfilePic} from "../api/UserBuddies";
import {getProfilePicture} from "../api/Users";

const SuggestionCard = ({ userId, limit }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleAddButtonClick = async (userId, reqUserId) => {
        await addBuddyRequest(userId, reqUserId);
        await fetchSuggestions();
    };

    const fetchSuggestions = async () => {
        try {
            const buddySuggestions = await fetchSuggestedBuddies(userId);
            const updatedSuggestions = await Promise.all(
                buddySuggestions.map(async (user) => {
                    if (!user.suggestedUser.profilePicBase64) {
                        const profilePicBase64 = await fetchUserProfilePic(user.suggestedUser.userId);
                        if (profilePicBase64) {
                            user.suggestedUser.profilePicBase64 = profilePicBase64;
                        }
                    }
                    return user;
                })
            );
            setSuggestions(updatedSuggestions);
        } catch (error) {
            console.error(error.message);
        }
    };


    useEffect(() => {
        fetchSuggestions();
    }, []);

    if (suggestions.length === 0) {
        return <div>Loading...</div>;
    }

    const displayedSuggestions = limit ? suggestions.slice(0, limit) : suggestions;

    return (
        <div className="suggestions justify-content-between mb-3 pt-4">
            {displayedSuggestions.map((sug, index) => (
                <div className="suggest-user" key={index}>
                    <div className="row ms-3">
                        <div className="col-md-2 col-sm-2">
                            <img
                                src={getProfilePicture(sug.suggestedUser)}
                                style={{maxWidth: "3rem", maxHeight: "3rem", minWidth: "3rem",
                                    minHeight: "3rem", borderRadius: "100%"}}
                                alt={`${sug.suggestedUser.firstName} ${sug.suggestedUser.lastName}`}
                            />
                        </div>
                        <div className="col-md-5 ms-0 col-sm-5 mx-auto">
                            <h6>
                                <a
                                    href={`/view-profile/${sug.suggestedUser.userId}`}
                                    className="profile-link"
                                >
                                    {`${sug.suggestedUser.firstName} ${sug.suggestedUser.lastName}`}
                                </a>
                                <em>({`${sug.mutualCount}`} mutual)</em>
                            </h6>
                            <p>Makes {sug.suggestedUser.category}</p>
                        </div>
                        <div className="col-md-3 col-sm-3 ml-auto">
                            <button
                                className="btn btn-primary rounded-pill"
                                onClick={() => handleAddButtonClick(sug.suggestedUser.userId, userId)}
                                style={{ width: "6rem", height: "2rem" }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestionCard;