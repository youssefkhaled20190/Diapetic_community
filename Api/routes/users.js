import Express from "express";
import { GetUsers , updateUser , GetAllUsers ,GetAllUsersByname } from "../controllers/user.js";

const router = Express.Router();

router.get("/find/:userid",GetUsers);
router.get("/all/:userid",GetAllUsers);
router.get("/search/:name",GetAllUsersByname);
router.put("/", updateUser)


export default router