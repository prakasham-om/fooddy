import mongoose from "mongoose";
import bcrypt from "bcrypt";

import crypto from 'crypto';

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    profile: {
        type:String,
        //required:true,
    },
    role:{
        type:String,
        enum:["owner","user"],
        default:"user",

    },
    passwordChangeDate:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
        
}) 

userSchema.pre('save',function(next){
   if(this.isModified('password')){
    this.password=bcrypt.hashSync(this.password,10);
    }
   next();
});

userSchema.methods.toJSON=function(){
    const obj=this.toObject();
    delete obj.password;
    return obj;
}

userSchema.methods.verifyPassword= function(jwtTimestamp){
    if(this.passwordChangeDate){
      const changeDate=parseInt(this.passwordChangeDate.getDate()/1000);
      return changeDate > jwtTimestamp;
    }
    return false;
  }
  

  userSchema.methods.generatePasswordResetToken= function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex'),
    this.passwordResetExpires=Date.now()+30000;
    return resetToken;

}

const userModel=mongoose.model("User",userSchema);
 
export default userModel;