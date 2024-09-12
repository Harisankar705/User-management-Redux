import React, { useEffect, useState } from "react";
import "./signup.css";
import avatar from "../../../assets/images/avatar.svg";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import wave from "../../../assets/images/wave.png";

import { signup, reset } from "../../../features/userAuth/authSlice";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { email, username, password, confirmPassword } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      toast.success("Signup success!Redirecting to Home!");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
    dispatch(reset());
    if (isSuccess) {
      setFormData({
        email: "",
        password: "",
        username: "",
        confirmPassword: "",
      });
    }
  }, [user, isSuccess, isError, navigate, dispatch]);
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z ]{3,40}$/.test(username)) {
      return toast.error("Name should be valid");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Email should be valid");
    } else if (password.length <= 4) {
      return toast.error("Password should be atleast 6 characters long!");
    }
    if (password !== confirmPassword) {
      toast.error("passwords should match!");
    } else {
      const userData = {
        username,
        email,
        password,
      };
      dispatch(signup(userData));
    }
  };

  return (
    <div>
      <img className="wave" src={wave} alt="wave-background" />
      <div className="container">
        <div className="img">{/* <img src={bg} alt="background" /> */}</div>
        <div className="login-content">
          <form onSubmit={onSubmit}>
            <img src={avatar} alt="avatar" />
            <h2 className="title">Welcome</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  type="text"
                  name="email"
                  className="input"
                  placeholder="Enter email"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  type="text"
                  name="username"
                  className="input"
                  placeholder="Enter username"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  type="password"
                  className="input"
                  placeholder="Enter the password"
                  name="password"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  type="password"
                  className="input"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="signup-link">
              <Link to="/">
                <p>Already have an Account? Login</p>
              </Link>
            </div>
            {isLoading && <p>Loading...</p>}
            <input
              type="submit"
              className="btn"
              value="Signup"
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
