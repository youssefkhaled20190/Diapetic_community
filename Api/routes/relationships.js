import Express from "express";
import {
  getRelationships,
  addRelationships,
  deleteRelationships,
} from "../controllers/relationship.js";

const router = Express.Router();

router.get("/", getRelationships);
router.post("/", addRelationships);
router.delete("/", deleteRelationships);

export default router;
