import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import events from "node:events"
import fs from "node:fs"
import { log } from "node:console"

const EventEmitter=events

class logger extends  EventEmitter
{
    log(message)
    {
        this.emit("message",message)
    }
}

let loggerObject=new  logger()



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
        origin:["http://localhost/5173"],
        methods:["get","post","put","delete","options"],
        credentials:true,
        maxAge:60
    }
))

//static assets are gone used by usign static methods here
app.use(express.static("./Assests"))





app.get(
    "/",(req,res) => {
        res.send("hello you are hitting cheating /routes")
        let message=generateMessageLog(req)
        loggerObject.log(message)        
    }
)

app.get(
    "/ideas",(req,res) => {  
       let text="hello user you currently hitting /ideas route"
       res.send(`response receivedss ${text}`)
       let message=generateMessageLog(req)     
       loggerObject.log(message)        
    }
)
app.get("/username", (req,res) => {
    res.send("hello user from hitting /username routes done")
    let message=generateMessageLog(req)
    loggerObject.log(message)        
})

app.get("/domain",(req,res) => {
    res.send("404,not found pagess")
    let message=generateMessageLog(req)
    loggerObject.log(message)
})


loggerObject.on(
    //loggeobject function log message value is get here as that event occurss
    "message",(messageValue) => {
        let filepath="./log.txt"
        console.log("message value passed is hrere",messageValue);
        fs.appendFileSync(filepath,messageValue)
        
    }
)

function generateMessageLog(req)
{
    let url=req.url
    let Dateobject=new Date()
    let timewithDate=Dateobject.toLocaleTimeString()
    let messageLog=`Url is:- ${url} DateTime:- ${timewithDate} \n`
    return messageLog
}
export default app


/*
notes add here
cors are too much importtant for use here we used use method of express to as middlware to check first things in requet 
to go it to the server,
cors means allowed this frontend or person only able to access if he not in same machine!
*/