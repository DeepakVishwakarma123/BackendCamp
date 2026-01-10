import dotenv from "dotenv"
import app from "./app.js"
import ConnectDb from "./db/mongoose-Connection-db.js"
import { connect } from "node:http2"
import { log } from "node:console"

dotenv.config({path:"./.env"})


const port=process.env.PORT


ConnectDb().then(
    (data) => {
        console.log(data)
        app.listen(port,() => {console.log(`listening on http://localhost:${port}`)})
    }
).catch(
    (err) => console.log(err)
)





//cors are the such thing whihc bother us usually a frontend team it nothign but the server shoudl allow whom 
//it is cross origin request sharing