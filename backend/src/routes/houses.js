import express from "express";
import houseController from "../controllers/houseController.js";
import { validateCreateHouse } from "../middleware/validation.js";

const router = express.Router();

router.get("/", houseController.getAll);

router.post("/", validateCreateHouse, houseController.create);

export default router;
