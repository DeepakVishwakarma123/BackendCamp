import { ExpressValidator } from "express-validator"
import { validationResult } from "express-validator"
import apiResponse from "../utils/api-response.js"
import apiError from "../utils/api-error.js"

function dummyTest(req,res)
{
const result=validationResult(req)
if(result.isEmpty())
{
    res.json(
        new apiResponse(
            200,"checking field",{
                data:"everything seem to right"
            }
        )
    )
}
else{
    throw new apiError(400,"error happend at the backend side")
}
}

export default dummyTest