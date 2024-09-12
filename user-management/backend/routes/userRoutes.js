const express=require('express')
const userRoute=express.Router()
const userController=require('../controller/userController')
const authMiddleware=require('../middleware/authMiddleware')
userRoute.post('/login',userController.handleLogin)
userRoute.post('/signup',userController.handleSignup)
userRoute.get('/',authMiddleware.verifyUserToken,userController.homePage)
userRoute.put('/update-profile',authMiddleware.verifyUserToken,userController.upload.single('image'),userController.editProfile)
module.exports=userRoute