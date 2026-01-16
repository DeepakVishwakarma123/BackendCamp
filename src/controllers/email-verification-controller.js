import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handlers.js";
import User from "../models/user-model.js"
import sendEmail from "../utils/sendEmailUtility.js";
import emailContentBodyGenWithUrl from "../utils/emailContentGenertionFunction.js";

// this function get the token matching output like a true or false
async function savedUserIfEmainVerficationTokenMatch(req,res,mathcFoundornot,savedUser)
{
  if(mathcFoundornot)
   {
  await User.updateOne(
  { _id: savedUser._id },
  {
    $set: {
      isEmailVerfied: true
    },
    $unset: {
      emailVefificationToken: "",
      emailVeficationExpiry: ""
    }
  }
);
   res.status(
    200
   ).json(
    new apiResponse(200,"email verfied succsuflly",{
        message:"email verfied"
    })
   )
   }
   else
   {
    throw new apiError(402,"email verification is failed re-try")
   }
}




let verfiyEmail=asyncHandler(
    async function (req,res,next)
    {
    let temporaryToken=req.params.temporaryToken
    let userId=req.params.userId

   // searchig for usre in database
   let savedUser=await User.findById(userId)
   console.log("the date storei in db is",savedUser.emailVeficationExpiry)
   
   if(Date.now()<=savedUser.emailVeficationExpiry)
    {
        let mathcFoundornot=savedUser.emailVerify(temporaryToken)
        //this function set email verified to field to true
        savedUserIfEmainVerficationTokenMatch(req,res,mathcFoundornot,savedUser)
    }
    else{
        if(savedUser.isEmailVerfied===false)
        {

       await User.updateOne(
            {
             _id:savedUser._id
            },
            {
                $unset:{
                    emailVeficationExpiry:"",
                    emailVefificationToken:""
                }
            }
        )


        let {tokenWithoutHash,tokenExpiry,hashedToken}=savedUser.GenerateTokenWithoutData()
  let AllRequiredTokens={tokenWithoutHash,tokenExpiry,hashedToken}
  let expireAt=new Date(tokenExpiry)
  savedUser.emailVeficationExpiry=expireAt
  savedUser.emailVefificationToken=hashedToken
  await savedUser.save({validateBeforeSave:false})


     let emailBodyObject={
               username:savedUser.username,
               intro:"Welcome to the base Camp",
               instructions:"For complete Verfication click on below link",
               text:"verify email",
               outro:"this is system generated email do not reply it"
           }
   
           // creating and passing a email verify route here
           let emailVerfiyUrl=`${req.protocol}://${req.get("host")}/api/v1/verify/${tokenWithoutHash}/${savedUser._id}`
   
           // generate email 
           let emailContentWithBodyData=emailContentBodyGenWithUrl(emailBodyObject,emailVerfiyUrl)
   
           // sending mail
           let response= await sendEmail({mailContent:emailContentWithBodyData,receiverEmailAddress:savedUser.email},emailVerfiyUrl)
      
           res.status(207).json(new apiResponse(204,"resended email for verification",{data:"email verfication mail sended succesfully"}))


        }
        else
        {
            throw new apiError(504,"already verified")
        }
    }

  
        // the above condition if our currne time is not less or = to set time 
        //then the code inside this would run
        //deleting the thing from database and resending link for verfication again
   
    }
    

)

export default verfiyEmail