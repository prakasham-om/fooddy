import express from 'express';

import { 
    registerUser,
    loginUser,protectUser,updateUser, 
    forgetPassword,resetPassword, changePassword } from '../controllers/userController.js';
    
const userRouter=express.Router();

userRouter.post("/signup",registerUser)
userRouter.get("/login",loginUser)
userRouter.route('/:id').patch(protectUser,updateUser)
userRouter.patch( '/changepassword/:id',protectUser,changePassword)
userRouter.route('/forgetpassword').post(forgetPassword)
userRouter.patch("/resetPassword/:token",resetPassword);

export default userRouter