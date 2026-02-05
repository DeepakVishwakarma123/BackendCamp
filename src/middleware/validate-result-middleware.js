import { validationResult } from "express-validator";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
function validateMiddleWare(req,res,next)
{
console.log("hello this si in middlware now")
let result=validationResult(req)
if(result.isEmpty())
{
    return next()
}
else{
   throw new apiError(402,"data is not in well format")
}
}

export default validateMiddleWare