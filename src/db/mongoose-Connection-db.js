import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"


dotenv.config({path:"./.env"})



async function ConnectDb()
{
    try {
    await mongoose.connect(process.env.MONGO_URI)
    return "😂 connection is successful"
} catch (error) {
    return Promise.reject(error)
    }
}

//asyn function always returns an promise which need to be consume

export default ConnectDb