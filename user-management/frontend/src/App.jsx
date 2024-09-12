import React from "react";
import UserLoginPage from "./pages/user/UserLoginPage";
import SignUpPage from './pages/user/SignUpPage';
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./features/store";
import Homepage from "./pages/user/Homepage";
import EditProfilePage from "./pages/user/EditProfilePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import CreateUserPage from "./pages/admin/CreateUserPage";
function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/edit-profile" element={<EditProfilePage/>}/>  
            <Route path="*" element={<div>Page Not Found</div>} />
            
            <Route path="/admin" element={<AdminLoginPage/>}/>
            <Route path='/admin/dashboard' element={<DashboardPage/>}/>
            <Route path='/admin/createUser' element={<CreateUserPage/>}/>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
