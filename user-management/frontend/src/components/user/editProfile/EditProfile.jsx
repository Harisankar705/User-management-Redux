import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
import { toast } from "react-toastify";
import wave from '../../../assets/images/wave.png';
import { updateProfile, reset } from "../../../features/userAuth/authSlice";
import './editProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = user?.token || null;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(defaultProfilePic);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setProfilePicturePreview(user.profilePicture ? `http://localhost:3000/uploads/${user.profilePicture}` : defaultProfilePic);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Clean up object URL on component unmount
    return () => {
      if (profilePicturePreview !== defaultProfilePic) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  const validateForm = () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Enter a valid email address!');
      return false;
    }
    return true;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setProfilePicturePreview(URL.createObjectURL(file));
        setProfilePicture(file);
      } else {
        toast.error("Please select a valid image file");
        e.target.value = ''; 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePicture) {
      formData.append("image", profilePicture);
    }

    try {
      await dispatch(updateProfile({ formData, token }));
      toast.success("Profile updated successfully");
      navigate("/");
      dispatch(reset());
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-profile-container">
      <img className='wave' src={wave} alt="wave" />

      <form className="profile-details" onSubmit={handleSubmit}>
        <img src={profilePicturePreview} alt="profile" className="profile-image" />

        <input 
          type="file"  
          accept="image/*" 
          onChange={handleProfilePictureChange} 
          className="file-input" 
          name='profilePicture' 
        />
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          className="input-field" 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          className="input-field" 
        />
        <button type="submit" className="save-edit-profile-button">Save Changes</button>
        <button type="button" onClick={handleCancel} className="cancel-edit">Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
