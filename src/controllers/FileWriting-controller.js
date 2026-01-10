import fs from "fs"
import apiResponse from "../utils/api-response.js"

function FileWriting(req,res,next)
{   
    try {
        fs.readFileSync("./fileWrite.txt",`${req.url}:---- ${new Date().toTimeString()} \n`)
        res.json(
            new apiResponse(202,"file writing done",{
                data:"successfully write file"
            }
            )
        )
    } catch (error) {
      next("somethign went wrong")
    }
}

export default FileWriting