import React, { useState } from "react";
import { register } from "../ApiInstance";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleOnchange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(data);
      console.log(res);
      toast.success("Registered Successfully!");
      setError(null);
      // setData({
      //   username: "",
      //   email: "",
      //   password: "",
      // });
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="form-container">
        <p className="title">Register Form</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={handleOnchange}
            required
            className="input"
          />
          <input
            type="email"
            placeholder="email"
            name="email"
            value={data.email}
            onChange={handleOnchange}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="password"
            name="password"
            value={data.password}
            onChange={handleOnchange}
            required
            className="input"
          />
          <button className="form-btn">Register</button>
        </form>
        <p className="sign-up-label">
          Already have an account?
          <Link to="/" className="sign-up-link">
            Sign In
          </Link>
        </p>
      </div>

      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </>
  );
};

export default Register;
