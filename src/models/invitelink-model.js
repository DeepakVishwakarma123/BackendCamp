import mongoose from "mongoose";
import { Schema } from "mongoose";
import { availableUserRoles } from "../utils/constants.js";

let InvitationSchema=new Schema(
    {
        invitedPersonEmail:{
            type:String,
            require:true,
            trim:true 
        },
        invitePersonRole:{
            type:String,
            enum:availableUserRoles
        },
        ProjectId:{
            type:Schema.Types.ObjectId,
            ref:"Project"
        }
    }
)

let InviteLink=mongoose.model("InviteDetail",InvitationSchema)
export default InviteLink
