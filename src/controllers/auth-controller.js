import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import User from "../models/user-model.js";
import emailContentBodyGenWithUrl from "../utils/emailContentGenertionFunction.js";
import sendEmail from "../utils/sendEmailUtility.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"


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
    let RefreshToken=userDocument.GenerateJWTRefreshToken()
    userDocument.refreshToken=RefreshToken
    await userDocument.save({validateBeforeSave:false})
    let options={
        Httponly:true,
        secure:true
    }
    res.cookie("AccessToken",AccessToken,options)
    res.cookie("RefreshToken",RefreshToken,options)
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

let logoutController=asyncHandler(
    async function (req,res,next) {
        //auth middlware give the object which actually has we need as user document we gone use it
        let userDocument=req.user 
        console.log(userDocument)
        //validation are necessary need here but let's do direc
    let updatedDoc=await User.findByIdAndUpdate(userDocument._id,{
            $set:{
                refreshToken:""
            }
        },{
            new:true
        })
         let options={
        Httponly:true,
        secure:true
    }
        res.clearCookie("AccessToken",options)
        res.clearCookie("RefreshToken",options)
        res.status(200).json(new apiResponse(200,"log out succesfully",{
            data:true
        }))
    }
)

let getCurrentUser=asyncHandler(
    async function (req,res) {
        let userDoc=req.user
        let user=await User.findById(userDoc._id).select("-password -refreshToken -forgotPasswordToken -emailVefificationToken -forgotPasswordExpiry -emailVeficationExpiry")
        res.status(200).json(
            new apiResponse(200,"current user info",user)
        )
    }
)

let forgotPasswordRequest=asyncHandler(
    async function (req,res) {
        //getting email from user input
        let {email}=req.body
        let UserDoc=await User.findOne({email:email})
        if(UserDoc)
        {
            let {tokenWithoutHash,tokenExpiry,hashedToken}=UserDoc.GenerateTokenWithoutData()
            UserDoc.forgotPasswordToken=hashedToken
            UserDoc.forgotPasswordExpiry=tokenExpiry
            await UserDoc.save({validateBeforeSave:false})
            let emailUrl=`${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${tokenWithoutHash}`
            //email working
            let emailGenContent=emailContentBodyGenWithUrl(
                {
                    username:UserDoc.username,
                    intro:"password reset email",
                    instructions:"click on below link to start the process",
                    linkText:"reset password",
                    outro:"system generated email do not reply to it"
                },
                emailUrl
            )
            let mailRes=await sendEmail({mailContent:emailGenContent,receiverEmailAddress:email})
            res.status(200).json(
                new apiResponse(200,"forgot password email is sended",{
                mailsend:"true"
                })
            )
        }
    }
)


let resetPassword=asyncHandler(
    async function (req,res) {
        let resetToken=req.params.resetToken
        let {newPassword}=req.body

        //token hahsed first
        let hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
        let userd=await User.findOne({forgotPasswordToken:hashedToken,forgotPasswordExpiry:{
            $gt:Date.now()
        }})
        if(userd)
        {
            userd.forgotPasswordToken=""
            userd.forgotPasswordExpiry=""
            userd.password=newPassword
            await userd.save({validateBeforeSave:false})
            return res.status(200).json(new apiResponse(200,"password reset succesful",{
                passwordreset:true
            })) 
        }
        throw new apiError(405,"token is invalid")
    }
)

let changePassword=asyncHandler(
    async function (req,res) {
        let usermiddlware=req.user
        let id=usermiddlware._id
        let userDoc=await User.findById(id)
        let {oldPassword,newPassword}=req.body

     let isPasswordValid=await userDoc.passWordVerify(oldPassword)
     console.log("hello",isPasswordValid)
     if(!isPasswordValid)
     {
        throw new apiError(404,"the entered password is not correct")
     }

     userDoc.password=newPassword
     await userDoc.save({validateBeforeSave:false})
     res.status(200).send("password changed")
    }
)


let refreshAccessToken=asyncHandler(
    async function (req,res) {
        let refreshToken=req.cookies["RefreshToken"]

        try {
          let decoedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
          let userDoc=await User.findById(decoedToken._id)

          if(!userDoc)
          {
            throw new apiError(404,"unauthorized access")
          }

          if(refreshToken!==userDoc.refreshToken)
          {
            throw new apiError(404,"refresh token is expired")
          }

          const options={
            Httponly:true,
            secure:true
          }

         let AccessToken=userDoc.GenerateJWTAccess()
         let refreshTokennew=userDoc.GenerateJWTRefreshToken()

         userDoc.refreshToken=refreshTokennew

        await userDoc.save({validateBeforeSave:false})
         res.status(200).cookie("AccessToken",AccessToken,options).cookie("RefreshToken",refreshTokennew,options).json(
            200,"access token and refresh token is generaed",{
                accesstoken:AccessToken,
                refreshToken:refreshTokennew
            }
         )

        } catch (error) {
            throw new apiError(405,"refresh token is expired try to login agian")
        }

        
    }
)
export {loginController,logoutController,getCurrentUser,resetPassword,changePassword,refreshAccessToken,forgotPasswordRequest}