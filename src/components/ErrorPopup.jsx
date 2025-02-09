import React, { useState } from "react";
import "../assets/css/ErrorPopup.css"; 
import "../assets/css/Popup.css"; 

const ErrorPopup = ({ errorMessage }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null; 

  return (
    <div className="alert alert-danger alert-white rounded">
      <button  type="button" className="close" aria-hidden="true" onClick={handleClose}>× </button>
      <div className="icon">
        <i className="fa fa-times-circle"></i>
      </div>
      <strong>Error!</strong> {errorMessage}
    </div>
  );
};

export default ErrorPopup;