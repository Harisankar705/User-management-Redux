import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../features/userAuth/authSlice";
import wave from "../../../assets/images/wave.png";
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    console.log("USER", user);
  }, [user, navigate]);

  if(!user)
  {
    return null
  }
  return (
    <div className="home-container">
      <img className="wave" src={wave} alt="wave" />
      <div className="profile-container">
        <div className="profile-picture">
          <img
            src={`http://localhost:3000/uploads/${user.profilePicture}`}
            alt="profile"
            className="profile-img"
          />
        </div>
        <div className="profile-details">
          <h2>{user.username || "User Name"}</h2>
          <p>Email: {user.email || "user@example.com"}</p>
          <Link to="/edit-profile" className="edit-profile-btn">
            Edit Profile
          </Link>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
