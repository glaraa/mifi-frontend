import React from "react";
import Navbar from "./Navbar";
import { useState,useEffect } from "react";
import '../assets/css/Common.css';
import { getUserData } from "../api/Users";
import SuggestionCard from "./SuggestionCard";
const SuggestBuddies = () => {
    const [userData, setUserData] = useState(null);
    const { userId } = userData || {};

    useEffect(() => {
      const fetchUserData = async () => {
          await getUserData(setUserData);
      };
  
      fetchUserData();
    }, []);

  return (
    <>
      <Navbar user={userData} setUserData={setUserData}></Navbar>
      <div className="common-background"  style={{minHeight:"100vh" }} >
      <section className="row justify-content-center pb-4 pt-4 " style={{minHeight:"90vh"  }}>
        <div className="card " style={{ maxWidth: "42rem", marginLeft: "5%", opacity: "0.95" }}>
          <div className="card-body pt -4 mt-2" >
            <h5>You may Like to Add</h5>
            <div className="col-sm-12 col-md-12 mx-auto">
              <div className="suggestions justify-content-between mb-3 pt-4">
                  {userId ? (
                      <SuggestionCard userId={userId}  />
                  ) : (
                      <div>Loading user data...</div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default SuggestBuddies;