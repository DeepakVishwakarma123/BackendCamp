//let,s create an function 
import apiResponse from "../utils/api-response.js"
import { ExpressValidator } from "express-validator"
import { validationResult } from "express-validator"
import apiError from "../utils/api-error.js"

const {query}=new ExpressValidator()
function testValidateControl(req,res)
{      
    console.log("hello ")
    // query("person").notEmpty()
    const result=validationResult(req)
    console.log(result)
    if(result.isEmpty())
    {
        res.send(`hello user name is here somedata is coming ${req.query.person}`)
    }
    else{
        throw new apiError(405,"error happend invalid data")
    }
//     res.json(
//  new apiResponse(200,"server getting value from url is done",{
//     message:`welcome back user ${personData}`
//  })
//     )

}

export default testValidateControl