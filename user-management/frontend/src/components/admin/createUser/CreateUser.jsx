import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser,reset} from "../../../features/adminAuth/adminSlice";
import './createUser.css'
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
import wave from "../../../assets/images/wave.png";


const CreateUser = () => {
  const [profilePictureReview, setProfilePictureReview] =
    useState(defaultProfilePic);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, admin, isSuccess, message,userData } = useSelector(
    (state) => state.admin
  );
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePictureReview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const usernamePattern = /^[a-zA-Z0-9]+$/

    if (!usernamePattern.test(username)) {
      toast.error("Username can only contain letters, numbers, underscores, and hyphens.");
      return;
    }
    if (!username || !email || !password || !confirmPassword) {
      toast.error("all fields are requied");
      return
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email address.");
      return;
    }
    if (password !== confirmPassword ) {
      toast.error("password and confirmpassword are not matching");
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    const userData = new FormData();
    userData.append("username", username);
    userData.append("email", email);
    userData.append("password", password);
    dispatch(createUser(userData
    ))
      .unwrap()
      .then(() => {
        toast.success("user created");
      })
      .catch((error) => {
        toast.error(`Error: ${error}`);
      });
      navigate('/admin/dashboard')
      dispatch(reset())
  };
  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setConfirmPassword("");
    setPassword("");
    setProfilePicture(null);
    setProfilePictureReview(defaultProfilePic);
  };
  return (
    <div className="create-user-container">
      <img className="wave" src={wave} alt="wave" />
      <div className="create-user-form">
        <h2>Create User</h2>
        <div className="profile-picture-container">
            <img src={profilePictureReview} alt="profile" className="profile-image"/>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" className="input-field" name="username"/>
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" name="EMAIL" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" className="input-field" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" className="input-field" />
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="confirmPassword" className="input-field" />
            </div>
            <div className="form-buttons">
                <button type="button" onClick={handleCancel} className="cance-button">Cancel</button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                    {isLoading ? 'Creating User...':"Save"}
                </button>
            </div>
            
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
