import React, { useEffect, useState } from 'react'
import './AdminLogin.css'
import avatar from "../../../assets/images/avatar.svg";
import administrator from '../../../assets/images/admin.png'
import wave from "../../../assets/images/wave.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { adminLogin, reset } from '../../../features/adminAuth/adminSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { admin, isError, isSuccess, isLoading, message } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  
    if (isSuccess || admin) {
      navigate('/admin/dashboard');
    }
  
    return () => {
      dispatch(reset());  // reset state on component unmount or after success/error
    };
  }, [isError, isSuccess, admin, message, navigate, dispatch]);
  

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const { email, password } = formData;

  const onLogin = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("All fields are required");
      return;
    }
  
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    const adminData = { email, password };
    dispatch(adminLogin(adminData));
  };
  

  // Ensure the return is inside the AdminLogin component function
  return (
    <div>
      <img className="wave" src={wave} alt="wave-background" />
      <div className="container">
        <div className="img"></div>
        <div className="login-content">
          <form onSubmit={onLogin}>
            <img src={administrator} alt="avatar" />
            <h2 className="title">Welcome Administrator!</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="input"
                  placeholder="Enter email"
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
                  type="password"
                  value={password}
                  onChange={onChange}
                  className="input"
                  placeholder="Enter the password"
                />
              </div>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
