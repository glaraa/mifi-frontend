import React, { useState } from "react";
import { profilePictureUpload } from "../api/UserProfileAPIs";

const ProfilePicUpload = ({ onImageUpload, userData ,setUserData }) => {
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    setIsImageUploaded(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (image) {
      const formData = new FormData();
      const file = event.target.querySelector('input[type="file"]').files[0];
      if (file) {
        formData.append("picture", file);
      }
      await profilePictureUpload(userData,formData,setUserData,onImageUpload);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between", height: "150px", textAlign: "center", borderRadius: "10px",
        padding: "20px", backgroundColor: "#fff", position: "relative"}} >
      {!isImageUploaded && ( <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <img src="/assets/images/uploadIcon.png" alt="Upload Icon" width="150" height="120" />
        </label>)}
      <input type="file" accept="image/*" onChange={handleFileChange} id="file-upload" style={{ display: "none" }}/>
      {image && ( <img src={image} alt="Preview" style={{ marginTop: "10px", width: "200px", 
      display: "block"}} />)}
      <button type="submit" className="btn btn-success rounded-pill mt-4" style={{ alignSelf: "center", marginTop: "auto"}}>
        Save
      </button>
    </form>
  );
};

export default ProfilePicUpload;