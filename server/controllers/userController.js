import userModel from "../models/userModel.js";
import jwtToken from 'jsonwebtoken';
import dontenv from 'dotenv';
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dontenv.config();

export const registerUser = async(req,res)=>{
    try{
        const user=new userModel({
            userName:req.body.userName,
            password:req.body.password,
            email:req.body.email,
            phone:req.body.phone,
            profile:req.body.profile,
        });

        const existUser= await userModel.findOne({$or:[{email:req.body.email}, {phone:req.body.phone}]});
        if(existUser){
          return res.status(400).json({   message:"user Email or Phone number already exist" });
        }
  
        const newUser=await user.save();
        const jwtSecret=process.env.JWT_SECRET;
        const token=jwtToken.sign({id:userModel._id},jwtSecret,{expiresIn:3000000})
        res.status(201).json({message:"user create success",result:{newUser,token}});
    }catch(err){
        res.status(400).json({
            message:err.message
        });
    }
}


export const loginUser=async(req,res)=>{
    try{
         const{userID,password}=req.body
         console.log(userID);
         if(!userID || !password){
            res.status(400).json({
                message:"Please provide userID and password"
            });
         } 
        const user=await userModel.findOne({$or:[{email:userID} ,{phone:userID}]}).select('+password');
        if(!user){
            res.status(400).json({
                message:"User not found"
            });
        }
        const isMatch=bcrypt.compareSync(password,user.password);
        if(!isMatch){
            res.status(400).json({
                message:"Password is not correct"
            });
        }
        
        const token=jwtToken.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"30d"});
     //    console.log("token",token)
        res.status(200).json({
            message:"Login Successfull",
            result:{id:user._id,token:token}
        });
    }catch{
        res.status(400).json({
            message:"Plese provide valid details"
        });
    } 
}


export const protectUser=async(req,res,next)=>{
    // console.log(req.headers.authorization);
   try{
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
     const token=req.headers.authorization.split(" ")[1];
     if(!token){
       return res.status(401).json({message:"unauthorized"})
     }
    
     jwtToken.verify(token,process.env.JWT_SECRET,async(err,decodedToken)=>{
 
       if(err){
         return res.status(401).json({message:"unauthorized user"})
       }
        console.log(decodedToken) 
     
      const user=await userModel.findById(decodedToken.id);
      console.log(user)
      if(!user){
       return res.status(401).json({message:"user of this id is not available"});
     }
 
     const passwordChangeVerify=await user.verifyPassword(decodedToken.iat);
     if(passwordChangeVerify){
       return res.status(401).json({message:"user's password is incorrect/changed"});
     }
     req.user=user;
     next();
     });
       
   }
   
   else{
    res.status(401).json({message:"unauthorized"})
   }
 }catch{
    res.status(401).json({message:"unauthorized"})
 }
}

export const updateUser=async(req,res)=>{

    try{
        const user=await userModel.findById(req.params.id);
        console.log(user)
        if(!user){
            res.status(400).json({
                message:"user not found"
            });
        }
        user.userName=req.body.userName || user.userName
        user.email=req.body.email || user.email
        user.phone=req.body.phone || user.phone
        user.profile=req.body.profile || user.profile
        const updatedUser=await user.save();
     //   const updatedUser=await userModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
     console.log(updatedUser);  
     res.status(200).json({
            message:"User Updated Successfully",
            user:updatedUser
        });
    }catch(err){
        res.status(400).json({
            message:err.message
        });
    }

}

export const forgetPassword=async(req,res,next)=>{
    try{
    const userInput = req.body.userInput;
    console.log(userInput);
    const user=await userModel.findOne({$or:[{email:userInput} ,{phone:userInput}]});
   // console.log(user);
    if(!user){
        res.status(400).json({ message:"user not found"});
    }
    

    const resetToken=user.generatePasswordResetToken();
    console.log("token", resetToken);
    await user.save({validateBeforeSave:false});

    const url=`${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`
    console.log(url)
    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
          type:"login",
          user:process.env.EMAIL_FROM,
          pass:process.env.EMAIL_PASSWORD
        }
    
      })
       transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to:user.email,
        subject:"Reset Password",
        html:`<h1>Hello ${user.userName}</h1>
        <p>Please click on the link below to reset your password</p>
        <a href="${url}" rel="noopener noreferrer" >Reset Password</a>
        <p>Thanks</p>
        `
      }).then(()=>{
        res.status(200).json({message:"Password reset link sent to your email address"});
      }).catch(async(err)=>{
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
        res.status(400).json({message:err.message});
      })
}catch{
    res.status(400).json({message:"something went wrong"})
    }
}


export const resetPassword=async(req,res)=>{
    console.log(req.params.token)
        const resetToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
        console.log(resetToken,"token")
        const user=await userModel.findOne({
            passwordResetToken:resetToken,
            passwordResetExpires:{$gt:Date.now()}
        }).select('+password');

        if(!user){
            res.status(400).json({
                message:"invalid token or has expired"
            });
        }
        user.password=req.body.password;
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        user.passwordChangeDate=Date.now();
        await user.save({validateBeforeSave:false});

        const Token=jwtToken.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"30d"})
        res.status(200).json({
            message:"Password Reset Successfully",
            user:user._id,
            result:Token,user
        });
    
}

export const changePassword =async(req,res)=>{
    try{
        const {oldpassword,password}=req.body;
        
        if(oldpassword === password){
            res.status(400).json({message:"new password cannot be same as old password"});
        }

        const user=await userModel.findById(req.params.id).select('+password');

        if(!user){res.status(400).json({message:"user not found"});}

        const isMatch=bcrypt.compareSync(oldpassword,user.password);

        if(!isMatch){res.status(400).json({message:"old password is not correct"});}
          
        user.password=password;
        user.passwordChangeDate=Date.now();

        await user.save({validateBeforeSave:false});

        res.status(200).json({
            message:"Password Changed Successfully",
            user:user
        });
    }catch{
        res.status(400).json({
            message:"Invalid credentials"
        });
    }
}