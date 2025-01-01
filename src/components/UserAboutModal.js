import React from "react";

const UserAboutModal = ({ isOpen, onClose, currentDescription, onSave }) => {
  const [description, setDescription] = React.useState(currentDescription || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(description);
    onClose();
  };

  return (
    <div className={`modal fade ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }}
      tabIndex="-1" role="dialog" aria-hidden={!isOpen} >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">About Yourself</h5>
            <button type="button" className="btn-close" aria-label="Close"  style={{ right: "20px", position:"absolute" }} onClick={onClose}> </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <textarea className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Your Likes/Your Location/Other Info About you that You'd Like to Share" />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success rounded-pill"> OK </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAboutModal;
