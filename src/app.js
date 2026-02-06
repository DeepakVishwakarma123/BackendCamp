import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { log } from "node:console"





dotenv.config({path:"./.env"})


const app=express()


app.use(cookieParser())
app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded(
{
    extended:true,
    limit:"10kb",
    parameterLimit:"2"
}
))
app.use(cors(
    {  
        origin:["http://localhost/5173","http://127.0.0.1:5500"],
        methods:["get","post","put","delete","options"],
        credentials:true,
        maxAge:60
    }
))

//static assets are gone used by usign static methods here
app.use(express.static("./Assests"))

import healthrouter  from "./routes/healthcheck-routes.js"
import RegisterRouter from "./routes/register-route.js"
import emailVerifyRouter from "./routes/email-verify-routes.js"
import testValidateRouter from "./routes/test-validate-route.js"
import dummyTestRouter from "./routes/dummy-routes..js"
import xssRouter from "./routes/xss-route.js"
import authRouter from "./routes/auth-route.js"
app.use("/api/v1/healthcheck",healthrouter)
app.use("/api/v1/register",RegisterRouter)
app.use("/api/v1/verify",emailVerifyRouter)
app.use("/api/v1/testval",testValidateRouter)
app.use("/api/v1/dummy",dummyTestRouter)
app.use("/api/v1/xss",xssRouter)
app.use("/api/v1/auth",authRouter)

app.get(
    "/",(req,res) => {
        res.send("hello you are hitting cheating /routes")
           
         
    }
)

app.get(
    "/ideas",(req,res) => {  
       let text="hello user you currently hitting /ideas route"
       res.send(`response receivedss ${text}`)   
    }
)
app.get("/username", (req,res) => {
    res.send("hello user from hitting /username routes done")
         
})

app.get("/domain",(req,res) => {
    res.send("404,not found pagess")
})

export default app


/*
notes add here
cors are too much importtant for use here we used use method of express to as middlware to check first things in requet 
to go it to the server,
cors means allowed this frontend or person only able to access if he not in same machine!
*/