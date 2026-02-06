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
        console.log(password)
    let passWordValid=await userDocument.passWordVerify(password)
    if(passWordValid)
    {
    let AccessToken=userDocument.GenerateJWTAccess()
    let options={
        httponly:true,
        secure:true
    }
    res.cookie("AccessToken",AccessToken,options)
    res.status(201).json(
        new apiResponse(201,"access token is generated",{
            data:true
        })
    )
    }
    else{
        throw new apiError(402,"password is not valid")
    }
    return next()
    }
    throw new apiError(402,"email is not valid")
}    
)

export default loginController