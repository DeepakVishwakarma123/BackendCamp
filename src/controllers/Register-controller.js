// we can,t using any async handler here
import asyncHandler from "../utils/async-handlers.js";
import sendEmail from "../utils/sendEmailUtility.js";
import emailContentBodyGenWithUrl from "../utils/emailContentGenertionFunction.js";
import User from "../models/user-model.js";
import apiResponse from "../utils/api-response.js"
import apiError from "../utils/api-error.js";
import { log } from "console";

// a custom method in Model is only can availbable to called via document its self
function tokenGenerate(userDocument)
{
 let {temporaryToken,tokenExpiry,hashedToken}=userDocument.GenerateTokenWithoutData()

 return {
    temporaryToken,tokenExpiry,hashedToken
 }
}

let registerController=asyncHandler(
    async function (req,res,next) {
    
        // parse data from post request
        let {username,email,password}=req.body


        // validate the data before saving operaion in db
        // here we ignore it first as we don,t need it now
        
        // savin email which not exist single time email get used
            let existUser=await User.findOne({$or:[
                {
                    email:email
                },
                {
                    username:username
                }
            ]})
        
        

        // findone returns the whole document or null in the case of not find anything
        if(existUser)
        {
            throw new apiError(202,"user already exist")
    
        }
        // in the case of falsy value as here is null
        // we register user as it not exist
        else
        {
            // we use create method here to save things
            // before saving we need do various operations
            // generating token for saving and other purpose 
            // using var show i access it anyplace
            var createdUser=await User.create(
                {
                    username:username,
                    email:email,
                    password:password,
                    isEmailVerfied:false,
                    // emailVeficationExpiry:AllRequiredTokens.tokenExpiry,
                    // emailVefificationToken:AllRequiredTokens.hashedToken,
                }
            )
        }

        // token generations for email verfication goes here
        let AllRequiredTokens=tokenGenerate(createdUser)

        createdUser.emailVefificationToken=AllRequiredTokens.hashedToken
        createdUser.emailVeficationExpiry=AllRequiredTokens.tokenExpiry


        await createdUser.save({validateBeforeSave:false})
     
        // we get outside from this function
        // sending email for verfication with verfication token as well
        let emailBodyObject={
            username:username,
            intro:"Welcome to the base Camp",
            instructions:"For complete Verfication click on below link",
            text:"verify email",
            outro:"this is system generated email do not reply it"
        }

        // creating and passing a email verify route here
        let emailVerfiyUrl=`${req.protocol}://${req.get("host")}/api/v1/verify/${AllRequiredTokens.temporaryToken}`

        // generate email 
        let emailContentWithBodyData=emailContentBodyGenWithUrl(emailBodyObject,emailVerfiyUrl)

        // sending mail
        let response= await sendEmail({mailContent:emailContentWithBodyData,receiverEmailAddress:email},emailVerfiyUrl)

        // sending created users as a response
        // this ensure only sensitive data not get sended to frontend
                let hidingCreateUserData=await User.findById(createdUser._id).select(
                "-password -emailVefificationToken -refreshToken  -forgotPasswordToken -forgotPasswordExpiry -emailVeficationExpiry -avatar"
            )

            if(!hidingCreateUserData)
            {
                throw new apiError(500,"something went wrong")

            }
            res.status(201).json(
                new apiResponse(200,"created user succesfully",{createdUser:hidingCreateUserData}) 
            )
        
        

    }
)



export default registerController