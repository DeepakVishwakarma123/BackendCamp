import asyncHandler from "../utils/async-handlers.js";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import jwt from "jsonwebtoken"
import User from "../models/user-model.js";

let authMiddlware=asyncHandler(
    async function (req,res,next) {
            let AccessToken=req.cookies?.AccessToken
            try {
                //it return payload data if we use synchronously
               let decodedToken=jwt.verify(AccessToken,process.env.ACCESS_TOKEN_SECRET)
               let id=decodedToken._id
               let userDoc=await User.findById(id)
               req.user=userDoc
               return next()
            } catch (error) {
                throw new apiError(405,"invalid Token or is Expired")
            }
    }
)
export default authMiddlware