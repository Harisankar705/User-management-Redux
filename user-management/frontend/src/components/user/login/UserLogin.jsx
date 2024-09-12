import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../../assets/images/avatar.svg";
import wave from "../../../assets/images/wave.png";
import "./userLogin.css";
import { toast } from "react-toastify";
import { login, reset } from "../../../features/userAuth/authSlice";

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
    }
    if (isError) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);
  

  

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const { email, password } = formData;

  const onLogin = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("All fields are required");
    } else {
      const userData = { email, password };
      console.log("USERDATA",userData)
      dispatch(login(userData));
    }
  };

  const inputRefs = useRef([]);
  
  useEffect(() => {
    const inputs = inputRefs.current;

    const addCl = (e) => {
      const parent = e.target.parentNode.parentNode;
      parent.classList.add("focus");
    };

    const remCl = (e) => {
      const parent = e.target.parentNode.parentNode;
      if (e.target.value === "") {
        parent.classList.remove("focus");
      }
    };

    inputs.forEach((input) => {
      if (input) {
        input.addEventListener("focus", addCl);
        input.addEventListener("blur", remCl);
      }
    });

    return () => {
      inputs.forEach((input) => {
        if (input) {
          input.removeEventListener("focus", addCl);
          input.removeEventListener("blur", remCl);
        }
      });
    };
  }, []);

  return (
    <div>
      <img className="wave" src={wave} alt="wave-background" />
      <div className="container">
        <div className="img"></div>
        <div className="login-content">
          <form onSubmit={onLogin}>
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
                  onChange={onChange}
                  value={email}
                  placeholder="Enter email"
                  ref={(el) => (inputRefs.current[0] = el)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  name="password"
                  onChange={onChange}
                  type="password"
                  className="input"
                  value={password}
                  placeholder="Enter the password"
                  ref={(el) => (inputRefs.current[1] = el)}
                />
              </div>
            </div>
            <div className="signup-link">
              <Link to="/signup">
                <p>New to here? Create Account</p>
              </Link>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
