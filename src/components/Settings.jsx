import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import { checkOldPassword } from "../api/Users";
import { updateUserDataDescription } from "../api/UserProfile";
import { resetPassword } from "../api/ForgotPassword";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("email");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userData, setUserData] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData) {
            setUserData(storedData);
        }
    }, []);

    const handleTabClick = (tab) => setActiveTab(tab);

    const updateEmail = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const updatedUserData = { ...userData, email: newEmail };
        console.log(userData);
        const response = await updateUserDataDescription(updatedUserData);
        console.log(response);
        if (response?.success===false) {
            setErrorMessage(response?.message || "Failed to update email.");
        } else {
            setUserData(response);
            setSuccessMessage("Email updated successfully!");
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        const response = await checkOldPassword(userData.userId, oldPassword,newPassword);
        console.log(response);
        if (response?.success===false){
            console.log(response);
            setErrorMessage(response?.message || "Incorrect old password.");
        } else {
            setSuccessMessage("Password updated successfully!");
        }
    };

    const updateName = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const updatedUserData = { ...userData, firstName: firstName, lastName: lastName };
        const response = await updateUserDataDescription(updatedUserData);

        if (response?.success===false){
            setErrorMessage(response?.message || "Failed to update name.");
        } else {
            setUserData(response);
            setSuccessMessage("Name updated successfully!");
        }
    };

    return (
        <>
            <Navbar user={userData} setUserData={setUserData} />

            {errorMessage && <ErrorPopup errorMessage={errorMessage} />}
            {successMessage && <SuccessPopup successMessage={successMessage} />}

            <div className="container pt-1 mt-2">
                <h3 className="text-center">SETTINGS</h3>

                <div className="row d-flex justify-content-center mt-4">
                    <div className="col-md-6">
                        <div className="list-group">
                            <div className={`list-group-item ${activeTab === "email" ? "active" : ""}`}
                                 onClick={() => handleTabClick("email")} style={{ cursor: "pointer" }}>
                                Change Email
                            </div>
                            <div className={`list-group-item ${activeTab === "password" ? "active" : ""}`}
                                 onClick={() => handleTabClick("password")} style={{ cursor: "pointer" }}>
                                Change Password
                            </div>
                            <div className={`list-group-item ${activeTab === "name" ? "active" : ""}`}
                                 onClick={() => handleTabClick("name")} style={{ cursor: "pointer" }}>
                                Change Name
                            </div>
                            <div className={`list-group-item ${activeTab === "delete" ? "active" : ""}`}
                                 onClick={() => handleTabClick("delete")} style={{ cursor: "pointer" }}>
                                Delete Account
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row d-flex justify-content-center mt-5">
                    <div className="col-md-6">
                        {activeTab === "email" && (
                            <div>
                                <h5>Change Email</h5>
                                <form onSubmit={updateEmail}>
                                    <div className="mb-3">
                                        <label className="form-label">New Email</label>
                                        <input type="email" className="form-control" value={newEmail}
                                               onChange={(e) => setNewEmail(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div>
                                <h5>Change Password</h5>
                                <form onSubmit={updatePassword}>
                                    <div className="mb-3">
                                        <label className="form-label">Old Password</label>
                                        <input type="password" className="form-control" value={oldPassword}
                                               onChange={(e) => setOldPassword(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input type="password" className="form-control" value={newPassword}
                                               onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        )}

                        {activeTab === "name" && (
                            <div>
                                <h5>Change Name</h5>
                                <form onSubmit={updateName}>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" value={firstName}
                                               onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" value={lastName}
                                               onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        )}


                        {activeTab === "delete" && (
                            <div className="tab-pane active">
                                <h5 className="text-danger">Delete Account</h5>
                                <div className="alert alert-warning mt-4">
                                    <p>Are you sure you want to delete your account?</p>
                                    <div className="d-flex justify-content-around">
                                        <button className="btn btn-danger" onClick={() => {window.location.href = `/delete-account`}} >Yes</button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => {window.location.href = `/settings`}}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
