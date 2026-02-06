import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import User from "../models/user-model.js";

let loginController=asyncHandler(
async function (req,res,next)
{
    //req body data is coming in from body in now this scenario
    let {email,password}=req.body;
 
    let userDocument=await User.findOne({email:email})

    if(userDocument)
    {
        await userDocument
    }
   
}    
)