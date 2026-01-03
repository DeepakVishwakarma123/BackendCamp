import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({path:"./.env"})


const app=express()



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
        // origin:process.env.originslist.split(",")
        origin:["http://localhost/5173","https://hoppscotch.io"],
        methods:["get","post","put","delete","options"],
        credentials:true
    }
))





app.get(
    "/",(req,res) => {
           res.send("hello you are hitting /route")
    }
)

app.get(
    "/ideas",(req,res) => {
        
       let text="hello user you currently hitting /ideas route"
       res.send(`response received ${text}`)
    }
)
app.get("/username", (req,res) => {
    res.send("hello user from hitting /username routes")
})

app.get("/domain",(req,res) => {
    res.send("404,not found page")
})

export default app


/*
notes add here
cors are too much importtant for use here we used use method of express to as middlware to check first things in requet 
to go it to the server,
cors means allowed this frontend or person only able to access if he not in same machine!
*/