import dotenv from "dotenv"
import express from "express"

dotenv.config({path:"./.env"})

let app=express()
const port=process.env.PORT


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

app.listen(port,() => {console.log(`listening on http://localhost:${port}`)})


//cors are the such thing whihc bother us usually a frontend team it nothign but the server shoudl allow whom 
//it is cross origin request sharing