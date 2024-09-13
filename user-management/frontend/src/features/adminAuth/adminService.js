import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/",
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const adminService = {};
adminService.adminLogin = async (admin) => {
  try {
    const response = await api.post("/admin", admin);
    console.log(response.data);
    if (response.data && response.data.token) {
      localStorage.setItem("admin", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);

      console.log("item set", admin);
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    const response = await api.get("/admin/userDetails",);
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
    const token = localStorage.getItem("token");
    const response = await api.post("/admin/create-user", userData, {
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
    throw new Error(message);
  }
};

adminService.deleteUser = async (userId) => {
  try {
    const response = await api.put(`/admin/delete-user/${userId}`);
    console.log("BLOCK RESPONSE", response.data);

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw error;
  }
};

adminService.editUser = async ({ formData, userId }) => {
  try {
    const response = await api.patch(`/admin/edit-user/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
  console.log("in logout");
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
};
export default adminService;
