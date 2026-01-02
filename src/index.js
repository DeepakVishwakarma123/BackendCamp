import dotenv from "dotenv"
import express from "express"

dotenv.config({path:"./.env"})

let app=express()
const port=process.env.PORT
console.log(port);

app.get(
    "/",(req,res) => {
           res.send("hello bro from server")
    }
)

app.get(
    "/ideas",(req,res) => {
        
       let text="hello user you currently hitting /ideas route"
       res.send(`response received ${text}`)
    }
)
app.get("/username", (req,res) => {
    res.send("hello user from express server")
})

app.listen(port,() => {console.log(`listening on http://localhost:${port}`)})
