const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const adminSchema = require("../model/adminSchema");
const jwt = require("jsonwebtoken");
let adminController = {};
const multer=require('multer')
const generateToken = (id) => {

  console.log("JWT",process.env.JWT_SECRET)
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const storage=multer.diskStorage({
  destination:function(req,file,cb)
  {
    cb(null,'uploads')
  },
  filename:function(req,file,cb)
  {
    const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()+1E9)
    const newFileName = file.fieldname + '-' + uniqueSuffix + '.jpeg'; // Store all files as '.jpeg'

    cb(null,newFileName)
  }
})
adminController.upload=multer({storage:storage})

adminController.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminSchema.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const responseData = {
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id),
      };
      res.json(responseData);
    console.log("RESPONSEDATA",responseData)
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    console.log("error in adminlogn", error);
  }
};
adminController.adminDashboard = async (req, res) => {
  try {
    console.log('in dashboard')
    const user = await userSchema.find();
    res.json({ user });
  } catch (error) {
    console.log("error in adminDashboard", error);
  }
};

adminController.createUser = async (req, res) => {
  try {
    console.log("IN CREATEUSER")
    const { username, email, password } = req.body;
    const userExists = await userSchema.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists.Try another!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userSchema.create({
      username,
      email,
      password: hashedPassword,
    });
   
    res.status(201).json({ _id:user._id,username:user.username,email:user.email });
  } catch (error) {
    res.status(500).json({ message: "Error occured during creating User" });
  }
};

adminController.editUser = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  try {
    // Check if user exists
    const userExists = await userSchema.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the new email already exists
    if (email && email !== userExists.email) {
      const emailExists = await userSchema.findOne({ email });
      if (emailExists) {
        console.log('email already exists')
        return res.status(400).json({ message: "Email already exists" });
        
      }
    }

    if (username) userExists.username = username;
    if (email) userExists.email = email;
    if (req.file) userExists.profilePicture = req.file.filename;

    const updatedUser = await userExists.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture
    });

  } catch (error) {
    console.error("Failed to edit user:", error);
    res.status(500).json({ message: "Failed to edit user" });
  }
};



adminController.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('userid',userId)
    const user=await userSchema.findByIdAndDelete(userId)

      const users=await userSchema.find()
    res.status(200).json({message: "User deleted successfully",
      users});
  } catch (error) {
    res.status(500).json({ message: "failed to delete user", error });
    console.log('failed to blocked',error)
  }
};


adminController.getUser = async (req, res) => {
  try {
    console.log('getuser')
    const users = await userSchema.find();
    res.json({ users });
  } catch (error) {
    console.log("error occured", error);
  }
};
module.exports = adminController;
