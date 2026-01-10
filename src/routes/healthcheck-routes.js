import { Router } from "express";
import healthcheckController from "../controllers/healthcheck-controller.js";
import FileWriting from "../controllers/FileWriting-controller.js";
const healthrouter=Router()

healthrouter.route("/").get(healthcheckController)
healthrouter.route("/instagram").get(FileWriting)

export default healthrouter