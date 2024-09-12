import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/",
});
const adminService = {};
adminService.adminLogin = async (admin) => {
  try {
    const response = await api.post("/admin", admin);
    console.log(response.data)
    if (response.data && response.data.token) {
      localStorage.setItem("admin", JSON.stringify( response.data.admin));
      localStorage.setItem("token", response.data.token);  // Store the token

      console.log('item set',admin)
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw error;
  }
};

adminService.userDetails = async () => {
  try {
    const token = localStorage.getItem("token");  // Retrieve the token from localStorage
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    const response = await api.get("/admin/userDetails", {
      headers: {
        Authorization: `Bearer ${token}`  // Add token to Authorization header
      }
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};


adminService.viewUser = async () => {
  try {
    const response = await api.get("/viewuser");
    console.log("IN VIEW USER");
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw error;
  }
};

adminService.createUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");  // Retrieve the token from localStorage
    const response = await api.post("/admin/create-user", userData, {
      headers: {  
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

adminService.blockUser = async (id) => {
  try {
    const response = await api.put(`/admin/block-user/${id}`);
    console.log('BLOCK RESPONSE',response.data)

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw error;
  }
};

adminService.editUser = async ({ formData, id }) => {
  try {
    const response = await api.post(`/edit-user/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw error;
  }
};

adminService.logout = () => {
  console.log('in logout')
  localStorage.removeItem("admin");
};
export default adminService;
