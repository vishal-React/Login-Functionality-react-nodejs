import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../ApiInstance";

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      console.log(res);
      setMessage("Reset link sent! Check your email.");
    } catch (error) {
      setError(error.response?.data?.message || "Error sending reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <p className="title">Forgot Password?</p>
        <form className="form" onSubmit={handleForgotPassword}>
          <p className="sign-up-label rememberPass">
            Remember Your password?
            <Link to="/" className="sign-up-link">
              Sign In
            </Link>
          </p>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="form-btn">Send Reset Link</button>
        </form>
      </div>

      {error && <h1 style={{ color: "red" }}>{error}</h1>}
      {loading && "Loading..."}
      {message && <h1>{message}</h1>}
    </>
  );
};

export default ForgotPassword;
