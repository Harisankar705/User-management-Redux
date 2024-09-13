const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userSchema=require('../model/userSchema')
const multer = require('multer')
const userController={}
const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"})
}

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

userController.upload=multer({storage:storage})

userController.handleSignup=async(req,res)=>{
  try {
    const {username,email,password}=req.body
    if(!username || !email ||!password)
    {
      throw new Error('enter all fields')
    }
    const exisitingUser=await userSchema.findOne({email})
    if(exisitingUser)
    {
      res.status(400)
      throw new Error("user already exists!")
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    const user=await userSchema.create({
      username,email,password:hashedPassword
    })
    if(user)
    {
      res.status(201).json({_id:user.id,username:user.username,email:user.email,token:generateToken(user._id)})
    }
    else
    {
      res.status(400)
      throw new Error("invalid credentails")
    }
  } catch (error) {
    console.error("erroc occured during user signup",error)
    res.status(500).json({ message: error.message });

  }
}

userController.handleLogin=async(req,res)=>{
  try {
    const {email,password}=req.body
    console.log(req.body)
    const user=await userSchema.findOne({email})
    if(!user)
    {
     res.status(400)
     throw new Error("user not found")
    }
    if(!user.isActive)
    {
      res.status(400)
      throw new Error("Your account is temporarily disabled!")
    }
    if(await bcrypt.compare(password,user.password))
    {
      const responseData={
        _id:user.id,
        username:user.username,
        email:user.email,
        profilePicture:user.profilePicture,
        token:generateToken(user._id)
      }
      console.log('user logged in',responseData)
      res.json(responseData)
    }
    else
    {
      res.status(400)
      throw new Error("invalid credentails")
    }
    } catch (error) {
    console.error("error occured during user signup",error)
    res.status(500).json({message:error.message})
  }
}


userController.editProfile=async(req,res)=>{
  const {username,email}=req.body
  console.log("in editprofile")
  try {
    const userExists=await userSchema.findById(req.user._id)
    if(!userExists)
    {
      res.status(404)
      throw new Error("user not found")
    }
    if(username)userExists.username=username
    if(email)userExists.email=email
    if(req.file)
    {
      userExists.profilePicture=req.file.filename
    }
    const updatedUser=await userExists.save()
    res.status(200).json({
      _id:updatedUser._id,
      username:updatedUser.username,
      email:updatedUser.email,
      profilePicture:updatedUser.profilePicture,
      token:generateToken(updatedUser._id)
    })

  } catch (error) {
    console.log('error occured',error)
  }
}

userController.homePage=async(req,res)=>{
  console.log('in home')
  const user=await userSchema.findById(req.user.id)
  console.log('user',user)
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ user });
}
module.exports=userController