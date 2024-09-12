import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

const signup = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    console.log("SIGNUP RESPONSE", response);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data.user || response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Signup error", error);
    throw error;
  }
};

const login = async (userData) => {
  try {
    console.log("USERDATA",userData)
    const response = await api.post("/login", userData);
    console.log("LOGIN RESPONSE", response);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data.user || response.data));
      console.log('item set',response.data)
    }
    return response.data;
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

const updateProfile=async({formData,token})=>{
  try {
    console.log("IN UPDATEPROFILE")
    const response=await api.put('/update-profile',formData,{
      headers:{
        "Content-Type":"multipart/form-data",
        "Authorization":`Bearer ${token}`
      }
    })
    if(response.data)
    {
      localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    console.error("Error occured during updateProfile",error)
    throw error
  }
}

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  signup,
  login,
  logout,
  updateProfile
};

export default authService;
