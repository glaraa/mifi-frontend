import React, { useState } from "react";
import "../assets/css/SuccessPopup.css"; 
import "../assets/css/Popup.css"; 

const SuccessPopup = ({ errorMessage }) => {
  const [visible, setVisible] = useState(true);
      const handleClose = () => {
        setVisible(false);
      };
    
      if (!visible) return null; 
    return (
      <div className="alert alert-success alert-white rounded">
        <button type="button" className="close" aria-hidden="true" onClick={handleClose}>×</button>
        <div className="icon"><i className="fa fa-check"></i></div>
        <strong>Success!</strong> {errorMessage}
      </div>
    );
  }
  export default SuccessPopup;
  