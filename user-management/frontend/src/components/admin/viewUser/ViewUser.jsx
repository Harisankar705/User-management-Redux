import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
import { useNavigate, useParams } from "react-router-dom";
import { editUser, reset ,userDetails} from "../../../features/adminAuth/adminSlice";
import { toast } from "react-toastify";
import wave from "../../../assets/images/wave.png";

function ViewUser() {
  const { userData ,admin} = useSelector((state) => state.admin);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] =
    useState(defaultProfilePic);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  useEffect(()=>{
    if(!admin)
    {
      navigate('/admin')
    }
  },[admin,navigate])
  const users = userData?.users || [];
  useEffect(() => {
    const user = users.find((user) => user._id === userId);
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setProfilePicture(user.profilePicture);
      setProfilePicturePreview(
        user.profilePicture
          ? `http://localhost:3000/uploads/${user.profilePicture}`
          : defaultProfilePic
      );
    }
  }, [userId, users]);
  useEffect(() => {
    if (users.length === 0) {
      dispatch(userDetails());
    }
  }, [dispatch, users.length]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
  
    dispatch(editUser({ formData, userId }))
      .unwrap() // Unwrap the promise to handle it more like normal async/await
      .then((response) => {
        // If the user edit was successful
        if (response) {
          toast.success("User edited successfully!");
          dispatch(reset());
          navigate("/admin/dashboard");
        } else {
          // If for some reason the response is empty or unsuccessful
          toast.error("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        // Handle backend error (e.g., email already exists)
        if (error === "Email already exists") {
          toast.error("Email is already in use. Please use a different one.");
        } else {
          toast.error(`An error occurred: ${error}`);
        }
      });
  };
  
  
  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setProfilePicture(null);
    setProfilePicturePreview(defaultProfilePic);
  };
  const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(file)
    {
        setProfilePicture(file)
        setProfilePicturePreview(URL.createObjectURL(file))
    }
  }
  const handleFileButtonClick=()=>{
    document.getElementById('fileInput').click()
  }
  return (
    <div className="edit-user-container">
      <img className="wave" src={wave} alt="wave" />
      <div className="edit-user-form">
        <h2>Edit User</h2>
        <div className="profile-picture-container">
          <img
            src={profilePicturePreview}
            alt="profile"
            className="profile-image"
          />
        </div>
        <form onSubmit={handleSubmit}>
            <button type="button" onClick={handleFileButtonClick} className="upload-button">Upload Image</button>
            <input id="fileInput"
              type="file"
              accept="image/*"
              name="profilePicture"
              onChange={handleFileChange}
              className="hidden-file-input"
            />
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="input-field"
              name="username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="input-field"
            />
          </div>
          <div className="form-group">
           
          </div>
          <div className="form-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="cance-button"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" >
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViewUser;
