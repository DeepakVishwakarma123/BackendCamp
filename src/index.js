import dotenv from "dotenv"
import app from "./app.js"

dotenv.config({path:"./.env"})


const port=process.env.PORT
console.log(process.env.originslist);


app.listen(port,() => {console.log(`listening on http://localhost:${port}`)})


//cors are the such thing whihc bother us usually a frontend team it nothign but the server shoudl allow whom 
//it is cross origin request sharing