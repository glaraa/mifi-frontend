import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form } from "react-bootstrap";
import {deleteAccount, updateUserData} from "../api/Users";
import Navbar from "./Navbar";
import ErrorPopup from "../components/ErrorPopup";

const DeleteAccount = () => {
    const [feedbackInput, setFeedbackInput] = useState("");
    const [userData, setUserData] = useState(null);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setErrorMessage("Please enter your password.");
            return;
        }
        const feedbackData = {
            username: userData.username,mailId: userData.email, feedback: feedbackInput
        };
        const response=await deleteAccount(userData.userId, password, feedbackData);
        if(response?.success===false){
            setErrorMessage(response?.message || "Failed to delete account.");
        }
        else{
            navigate("/");
            localStorage.clear();
        }
    };

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData) {
            setUserData(storedData);
            updateUserData(setUserData, storedData.userId);
        }
    },[]);

    return (
        <>
            <Navbar user={userData} setUserData={setUserData} />
            <Container className="d-flex align-items-center justify-content-center mt-1">
                <div className="jumbotron p-4 border rounded shadow" style={{ maxWidth: "40rem" }}>
                    <h3>DELETE ACCOUNT</h3>
                    <hr />
                    <p>We are sorry to hear your decision to delete your account.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Help us know why you're leaving</Form.Label>
                            <Form.Select value={feedbackInput} onChange={(e) => setFeedbackInput(e.target.value)} required>
                                <option value="">Select Reason</option>
                                <option value="Personal Reasons">Personal Reasons</option>
                                <option value="Isn't Engaging enough">Isn't Engaging enough</option>
                                <option value="Lack of Features">Lack of Features</option>
                                <option value="Need a Break">Need a Break</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter your password to confirm</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </Form.Group>

                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                        <Button type="submit" className="w-100 mt-3" variant="danger">Delete Account</Button>
                    </Form>
                </div>
            </Container>
        </>
    );
};

export default DeleteAccount;