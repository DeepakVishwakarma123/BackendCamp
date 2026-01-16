import { Schema } from "mongoose";
import mongoose  from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import dotenv from "dotenv"
import apiError from "../utils/api-error.js";



dotenv.config({
    path:"./.env"
})
const userschema=new Schema(
    {
        avatar:{
            type:{
                url:String,
                localPath:String
            },
            default:{
                url:``,
                localPath:""
            }
        },
        username:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            index:true,
            trim:true
        },
        fullName:
        {
            type:String,
            trim:true,
        },
        password:{
            type:String,
            //custom error for use array like syntax
            requird:[true,"password is required"]
        },
        isEmailVerfied:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        forgotPasswordToken:{
            type:String
        },
        forgotPasswordExpiry:
        {
            type:Date
        },
        emailVefificationToken:
        {
            type:String
        },
        emailVeficationExpiry:{
         type:Number
        }
    },
    {
        timestamps:true
    }
)

//literally it invoke everytime like a when we do any save in db that,s why
userschema.pre("save",async function () {
    if(this.isModified("password"))
    {   
       
        
        
        //bcrypt hash return promise with resulting hash here due to await we get directly resolved value
        this.password=await bcrypt.hash(this.password,10)  
        
    }
})



userschema.methods.passWordVerify=async function(passWord)
{
//we have pasword hash in this that,s why we need to take orignal plain password from outside!!!
return await bcrypt.compare(passWord,this.passWord)
}

userschema.methods.emailVerify=async function (temporaryToken)
{
let tokenVerifyOrnot=bcrypt.compare(temporaryToken,this.emailVefificationToken)
return tokenVerifyOrnot

}
//generate jwt with payload
userschema.methods.GenerateJWTAccess=function ()
{
let AccessToken=jwt.sign({_id:this._id,username:this.username,email:this.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.
ACCESS_TOKEN_EXPIRES})
return AccessToken
}

userschema.methods.GenerateJWTRefreshToken=function ()
{
    let RefreshToken=jwt.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES})
    return RefreshToken
}

userschema.methods.GenerateTokenWithoutData=function ()
{
  let tokenWithoutHash=crypto.randomBytes(32).toString("hex")
  console.log("tokenwithout hash values",tokenWithoutHash);
  
  let tokenExpiry=Date.now()+(2*60*1000) //3minuts
  let hashedToken=crypto.createHash("sha256").update(tokenWithoutHash).digest("hex")
  return {tokenWithoutHash,tokenExpiry,hashedToken}
}



const User=mongoose.model("User",userschema)
export default User


