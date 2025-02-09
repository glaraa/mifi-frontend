import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import {getProfilePicture, getUserData} from "../api/Users";
import {userFeedCreations} from "../api/Feed";
import {fetchDetailedCreations} from "../api/UserProfile";
import '../assets/css/Common.css'

const FeedPage = () => {
    const [userData, setUserData] = useState(null);
    const [creations, setCreations] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = async () => {
            await getUserData(setUserData);
            console.log(userData);
        }
        fetchUserData();
    },[])

    useEffect(()=> {
        const getCreationData = async () => {
            const creationIdsResponse = await userFeedCreations(userData.userId);
            const creationDetailsPromises = creationIdsResponse.response.map(async (creation) => {
                return await fetchDetailedCreations(creation.creationId);
            });
            const details = await Promise.all(creationDetailsPromises);
            console.log(details.response);
            setCreations(details.map(detail => detail.response));
            setLoading(false);
        }
        if (userData) {
        getCreationData();
        }
        }, [userData])

    return (
        <div>
            <Navbar user={userData} setUserData={setUserData}></Navbar>
            {loading ? (
            <div className="loader">
                <span>Loading...</span>
            </div>
            ) : (
            <section className="common-background row justify-content-center pt-3 pb-3">
                <div className="card col-md-12" style={{ maxWidth:'38rem'}}>
                    <div className="card-body">
                        {creations.map(creation => (
                            <div key={creation.user.username} className="row">
                                <div className="col-md-2">
                                    <img src={getProfilePicture(creation.user)}
                                         className="border rounded-circle " alt="Avatar"
                                         style={{maxWidth: '3rem', maxHeight: '3rem', minWidth: '3rem',
                                             minHeight: '3rem', borderRadius: '50%'}}
                                    />
                                </div>
                                <div className="col-md-7">
                                    <a href={`view-profile/${creation.user.userId}`} className="text-dark mb-0">
                                        <strong>{`${creation.user.firstName} ${creation.user.lastName}`}</strong>
                                    </a>
                                    <a href="#" className="text-muted d-block" style={{marginTop: '-6px'}}>
                                        <small>{creation.createdDate}</small>
                                    </a>
                                </div>
                                <div className="mt-3">
                                    <p>{creation.caption}</p>
                                </div>
                                <div className="bg-image hover-overlay ripple rounded-0 pb-5">
                                    <a href={`/expand/${creation.creationId}`}>
                                        <img
                                            src={`data:image/jpeg;base64,${creation.creationBase64}`}
                                            className="w-100"
                                            style={{maxWidth: '35rem', maxHeight: '25rem', minWidth: '35rem',
                                                minHeight: '25rem'}}
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>)}
        </div>
    );
};

export default FeedPage;
