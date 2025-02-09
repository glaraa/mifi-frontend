import React, { useEffect, useState } from "react";
import config from "../config/config";
import { useNavigate } from "react-router-dom";

const RecentPhotos = ({creations,loading}) => {
  const navigate = useNavigate();

  const handlePhotoClick = (creationId) => {
    navigate(`/expand/${creationId}`);
  };

  if (loading) {
    return <p>Loading recent photos...</p>;
  }

  if (!creations.length) {
    return <p>No recent photos available.</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-0 mb-1">
        <p className="lead fw-normal ms-4">Recent photos</p>
      </div>
      <div className="row ms-3 me-3 g-2 mb-3">
        {creations.map((creation) => (
          <div className="col me-0 mb-2" key={creation.creationId}>
              <img
                src={`data:image/jpeg;base64,${creation.creationBase64}`}
                style={{ maxWidth: "350px", minWidth: "350px", maxHeight: "350px",  minHeight: "350px", cursor: "pointer" }}
                alt="Recent creation"  className="w-100 rounded-3 mb-1 ml-4" onClick={() => handlePhotoClick(creation.creationId)}
              />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPhotos;
