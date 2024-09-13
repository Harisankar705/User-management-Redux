import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  adminLogout,
  deleteUser,
  reset,
  userDetails,
} from "../../../features/adminAuth/adminSlice";
import defaultProfilePic from "../../../assets/images/defaultProfile.png";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, isError, isLoading, isSuccess, message,admin } = useSelector(
    (state) => state.admin
  );

  
  useEffect(()=>{
    if(!admin)
    {
      navigate('/admin')
    }
    else
    {
      dispatch(userDetails())
    }
  },[dispatch,admin,navigate])

  const users = userData?.users || [];
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleViewUser = (userId) => {
    navigate(`/admin/viewUser/${userId}`);
  };

  const handleDeleteUser=async(userId)=>{
    if(window.confirm("Are you sure?"))
    {
      try {
       const response= await dispatch(deleteUser(userId)).unwrap()
       if(response.message)
       {
        toast.success(response.message)
       }
        dispatch(userDetails())
      } catch (error) {
        console.log("Error occured while deleting user")
        toast.error('failed to delete user')
      }
    }
  }

  const onLogout = () => {
    dispatch(adminLogout());
    navigate('/');
  };

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
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td className="profilePicture">
                    <img
                      src={
                        user.profilePicture ? `http://localhost:3000/uploads/${user.profilePicture}` :
                        defaultProfilePic
                      }
                      alt={`${user.name}'s profile`}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  </td>
                  <td className="user-name">{user.username}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="view-btn">
                    <button onClick={() => handleViewUser(user._id)}>View</button>
                  </td>
                  <td className="block-btn">
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No results</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
