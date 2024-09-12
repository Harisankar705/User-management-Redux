import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  adminLogout,
  blockUser,
  reset,
  userDetails,
} from "../../../features/adminAuth/adminSlice";
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(userDetails());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const users = userData?.users || [];
  const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (userId) => {
    navigate(`/admin/viewDetails/${userId}`);
  };

  // Handle blocking user
  const handleBlockUser =async (userId) => {
    if(window.confirm("Are you sure"))
    {
      dispatch(blockUser(userId))
    }
  };
  const onLogout=()=>{
    dispatch(adminLogout())
    navigate('/')
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-box">
        <div className="admin-header">
          <h2 className="header-title">Users</h2>
          <input
            type="search"
            className="search-bar"
            placeholder="Search user by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
<button className="logout-btn" onClick={() => navigate('/admin/createUser')}>Create User</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <table className="user-details">
          <thead>
            <tr>
              <th className="profilePicture">Profile Picture</th>
              <th className="userName">Name</th>
              <th className="userEmail">Email</th>
              <th className="Action">Action</th>
              <th className="block-user">Block</th>
            </tr>
          </thead>
          <tbody className="user-body">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="profilePicture">
                    <img
                      src={
                        user.profilePicture ?`http://localhost:3000/uploads/${user.profilePicture}` :
                        defaultProfilePic
                      }
                      alt={`${user.name}'s profile`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td className="user-name">{user.username}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="view-btn">
                    <button onClick={() => handleViewUser(user._id)}>
                      View
                    </button>
                  </td>
                  <td className="block-btn">
                    <button onClick={() => handleBlockUser(user._id)}>
                      {user.isActive ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
