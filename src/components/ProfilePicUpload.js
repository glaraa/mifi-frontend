import React, { useState } from "react";

const ProfilePicUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setPreview(null);
      setError("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("picture", file);

      const response = await fetch("/api/user/addpropic", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageUpload(data); // Pass updated user data to parent
        alert("Profile picture updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to upload profile picture.");
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <label htmlFor="file" className="btn btn-outline-primary">  Upload Image </label>
      <input type="file" accept="image/*" id="file" onChange={handleFileChange} style={{ display: "none" }} />
      {preview && (
        <div className="mt-3">
          <img src={preview}  alt="Preview" className="img-thumbnail" style={{ width: "200px" }} />
        </div>
      )}
      {error && <p className="text-danger mt-2">{error}</p>}
      <button type="button" className="btn btn-success mt-3" onClick={handleUpload} > Save </button>
    </div>
  );
};

export default ProfilePicUpload;
