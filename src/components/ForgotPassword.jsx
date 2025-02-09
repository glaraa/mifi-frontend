import React, { useState } from "react";
import { forgotPassword, validateOtp, resetPassword } from "../api/ForgotPassword";
import ErrorPopup from "../components/ErrorPopup";
import SuccessPopup from "../components/SuccessPopup";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // Step 1: Forgot Password, Step 2: OTP Validation, Step 3: Reset Password
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Handle Forgot Password API Call
    const handleForgotPassword = async () => {
        try {
            await forgotPassword(email, username);
            setMessage("OTP sent successfully!");
            setError(null);
            setStep(2); // Move to OTP verification step
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Failed to send OTP");
        }
    };

    // Handle OTP Validation API Call
    const handleValidateOtp = async () => {
        try {
            await validateOtp(email, otp);
            setMessage("OTP verified successfully!");
            setError(null);
            setStep(3); // Move to Reset Password step
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            await resetPassword(email, password);
            setMessage("Password reset successful! Redirecting to login...");
            setError(null);
            setTimeout(() => (window.location.href = "/"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "400px" }}>
                <h2 className="text-center mb-3">Forgot Password</h2>

                {error && <ErrorPopup errorMessage={error} />}
                {message && <SuccessPopup errorMessage={message} />}

                <div className="form-group mt-3">
                    {/* Step 1: Forgot Password */}
                    {step === 1 && (
                        <>
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="btn btn-primary w-100 mt-2" onClick={handleForgotPassword}>
                                Send OTP
                            </button>
                        </>
                    )}

                    {/* Step 2: OTP Validation */}
                    {step === 2 && (
                        <>
                            <label>OTP</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter OTP sent to your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button className="btn btn-primary w-100 mt-2" onClick={handleValidateOtp}>
                                Verify OTP
                            </button>
                        </>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <>
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button className="btn btn-primary w-100 mt-2" onClick={handleResetPassword}>
                                Reset Password
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;