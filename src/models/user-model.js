import { Schema } from "mongoose";
import mongoose  from "mongoose";

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
         type:Date
        }
    },
    {
        timestamps:true
    }
)

const user=mongoose.model("User",userschema)
export default user