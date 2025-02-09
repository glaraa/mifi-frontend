import React, { useState } from 'react';
import {uploadCreation} from "../api/Creation";

const UserCreationsModal = ({ isOpen, onClose, onSubmit,userData }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setIsImageUploaded(true);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log("data",userData);
    formData.append("creation", event.target.creations.files[0]);
    formData.append("caption", caption);
    formData.append("userId", userData.userId);
    console.log("id",userData.userId);
    try {
        setLoading(true);
        await uploadCreation(formData);
        onSubmit();
        onClose();
      } catch (error) {
        setError(error.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className={`modal fade ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }}
      tabIndex="-1" role="dialog" aria-hidden={!isOpen} >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h6>Add Your Creation Here</h6>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} style={{ right: "20px", position:"absolute" }} ></button>
          </div>
          <form action="/user/addCreations" encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="modal-body sm-3">
              {!isImageUploaded ? (
                <div style={{ cursor: "pointer" }}>
                  <label htmlFor="fileUpload"> <img className="pb-4" src="/assets/images/uploadIcon.png"
                    alt="Upload Icon" width="150" height="150" />
                  </label>
                </div>
              ) : (<img id="output2" className="pb-4" src={image} alt="Preview" width="200" />)}
              <input type="file" accept="image/*" name="creations" id="fileUpload"
                onChange={handleImageChange} style={{ display: "none" }} />
              <textarea className="form-control" rows="2" name="caption" value={caption}
                onChange={(e) => setCaption(e.target.value)} placeholder="About your Creation" />
            </div>
            <div className="modal-footer">
            <button type="submit" className="btn btn-success rounded-pill" disabled={loading} style={{width: "5.5rem",fontSize:"0.9rem"}}>
                {loading ? "Uploading..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreationsModal;
